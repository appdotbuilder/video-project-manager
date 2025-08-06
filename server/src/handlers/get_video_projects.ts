
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type VideoProject } from '../schema';

export const getVideoProjects = async (): Promise<VideoProject[]> => {
  try {
    const results = await db.select()
      .from(videoProjectsTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Getting video projects failed:', error);
    throw error;
  }
};
