
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type GetVideoProjectInput, type VideoProject } from '../schema';
import { eq } from 'drizzle-orm';

export const getVideoProject = async (input: GetVideoProjectInput): Promise<VideoProject | null> => {
  try {
    const results = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, input.id))
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Get video project failed:', error);
    throw error;
  }
};
