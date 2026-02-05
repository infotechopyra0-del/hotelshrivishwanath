import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Customer from '@/models/Customer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    await dbConnect();

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      vipUsers,
      blacklistedUsers,
      verifiedUsers,
      totalAdmins,
      bronzeUsers,
      silverUsers,
      goldUsers,
      platinumUsers,
      newUsersThisMonth,
      totalRevenue,
      totalBookings,
      totalLoyaltyPoints,
    ] = await Promise.all([
      Customer.countDocuments({}),
      Customer.countDocuments({ status: 'Active' }),
      Customer.countDocuments({ status: 'Inactive' }),
      Customer.countDocuments({ status: 'VIP' }),
      Customer.countDocuments({ status: 'Blacklisted' }),
      Customer.countDocuments({ isVerified: true }),
      Customer.countDocuments({ role: 'admin' }),
      Customer.countDocuments({ totalSpent: { $lt: 20000 } }),
      Customer.countDocuments({ totalSpent: { $gte: 20000, $lt: 50000 } }),
      Customer.countDocuments({ totalSpent: { $gte: 50000, $lt: 100000 } }),
      Customer.countDocuments({ totalSpent: { $gte: 100000 } }),
      Customer.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
      Customer.aggregate([
        { $group: { _id: null, total: { $sum: '$totalSpent' } } },
      ]),
      Customer.aggregate([
        { $group: { _id: null, total: { $sum: '$totalBookings' } } },
      ]),
      Customer.aggregate([
        { $group: { _id: null, total: { $sum: '$loyaltyPoints' } } },
      ]),
    ]);

    const topCustomers = await Customer.find({ status: { $ne: 'Blacklisted' } })
      .select('name email totalSpent totalBookings loyaltyPoints status')
      .sort({ totalSpent: -1 })
      .limit(10)
      .lean();

    const recentUsers = await Customer.find({})
      .select('name email status createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrationTrend = await Customer.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const stats = {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        vipUsers,
        blacklistedUsers,
        verifiedUsers,
        totalAdmins,
        newUsersThisMonth,
      },
      tiers: {
        bronze: bronzeUsers,
        silver: silverUsers,
        gold: goldUsers,
        platinum: platinumUsers,
      },
      financial: {
        totalRevenue: totalRevenue[0]?.total || 0,
        averageSpending: totalUsers > 0 ? (totalRevenue[0]?.total || 0) / totalUsers : 0,
        totalBookings: totalBookings[0]?.total || 0,
        averageBookingsPerUser: totalUsers > 0 ? (totalBookings[0]?.total || 0) / totalUsers : 0,
      },
      loyalty: {
        totalLoyaltyPoints: totalLoyaltyPoints[0]?.total || 0,
        averagePointsPerUser: totalUsers > 0 ? (totalLoyaltyPoints[0]?.total || 0) / totalUsers : 0,
      },
      topCustomers,
      recentUsers,
      registrationTrend,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}