import { env } from '../config/env';
import { getSupabaseClient } from './supabaseClient';

export const getStorageClient = () => getSupabaseClient().storage;

export const getBucket = (bucketName?: string) => {
	const resolvedBucket = bucketName ?? env.supabaseStorageBucket;

	if (!resolvedBucket) {
		throw new Error('Supabase storage bucket name not provided. Set SUPABASE_STORAGE_BUCKET or pass a bucket name.');
	}

	return getStorageClient().from(resolvedBucket);
};
