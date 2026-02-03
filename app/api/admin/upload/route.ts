
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
	console.error('Missing Cloudinary configuration:', {
		cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
		api_key: !!process.env.CLOUDINARY_API_KEY,
		api_secret: !!process.env.CLOUDINARY_API_SECRET
	});
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized. Admin access required.' },
				{ status: 401 }
			);
		}

		if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
			console.error('Cloudinary configuration missing');
			return NextResponse.json(
				{ error: 'Server configuration error. Please contact administrator.' },
				{ status: 500 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || typeof file === 'string') {
			return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
		}

		// Read file as buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to Cloudinary with proper error handling and timeout
		const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
			const uploadTimeout = setTimeout(() => {
				reject(new Error('Upload timeout - file may be too large or connection is slow'));
			}, 60000); // 60 second timeout

			const stream = cloudinary.uploader.upload_stream(
				{ 
					resource_type: 'image',
					folder: 'hotel-gallery', // organize uploads in folder
					transformation: [
						{ width: 1920, height: 1080, crop: 'limit' }, // limit max size
						{ quality: 'auto:good' }, // optimize quality
						{ format: 'auto' } // auto format selection
					]
				}, 
				(error, result) => {
					clearTimeout(uploadTimeout);
					
					if (error) {
						console.error('Cloudinary upload error details:', error);
						reject(new Error(`Cloudinary upload failed: ${error.message}`));
						return;
					}
					
					if (!result || !result.secure_url) {
						reject(new Error('Upload completed but no URL returned'));
						return;
					}
					
					resolve({
						secure_url: result.secure_url,
						public_id: result.public_id
					});
				}
			);
			
			stream.end(buffer);
		});

		return NextResponse.json({ 
			url: uploadResult.secure_url, 
			publicId: uploadResult.public_id 
		});
	} catch (error: any) {
		console.error('Cloudinary upload error:', {
			message: error.message,
			http_code: error.http_code,
			name: error.name,
			stack: error.stack
		});
		
		// Handle specific Cloudinary errors
		if (error.http_code === 401) {
			return NextResponse.json(
				{ error: 'Cloudinary authentication failed. Please check API credentials.' },
				{ status: 500 }
			);
		}
		
		if (error.http_code === 499 || error.name === 'TimeoutError') {
			return NextResponse.json(
				{ error: 'Upload timeout. Please try with a smaller image or check your connection.' },
				{ status: 408 }
			);
		}
		
		if (error.message?.includes('timeout')) {
			return NextResponse.json(
				{ error: 'Upload timeout. Please try with a smaller image.' },
				{ status: 408 }
			);
		}
		
		return NextResponse.json(
			{ error: error.message || 'Upload failed. Please try again.' },
			{ status: 500 }
		);
	}
}
