
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type CreateVideoProjectInput, type VideoProject } from '../schema';

export const createVideoProject = async (input: CreateVideoProjectInput): Promise<VideoProject> => {
  try {
    // Insert video project record
    const result = await db.insert(videoProjectsTable)
      .values({
        name: input.name,
        description: input.description
      })
      .returning()
      .execute();

    // Return the created video project
    const videoProject = result[0];
    return videoProject;
  } catch (error) {
    console.error('Video project creation failed:', error);
    throw error;
  }
};
