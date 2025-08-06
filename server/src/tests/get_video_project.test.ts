
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type GetVideoProjectInput } from '../schema';
import { getVideoProject } from '../handlers/get_video_project';

describe('getVideoProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return a video project when it exists', async () => {
    // Create a test video project
    const insertResult = await db.insert(videoProjectsTable)
      .values({
        name: 'Test Project',
        description: 'A test video project'
      })
      .returning()
      .execute();

    const createdProject = insertResult[0];

    // Test retrieving the project
    const input: GetVideoProjectInput = {
      id: createdProject.id
    };

    const result = await getVideoProject(input);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdProject.id);
    expect(result!.name).toEqual('Test Project');
    expect(result!.description).toEqual('A test video project');
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when project does not exist', async () => {
    const input: GetVideoProjectInput = {
      id: 999999 // Non-existent ID
    };

    const result = await getVideoProject(input);

    expect(result).toBeNull();
  });

  it('should return project with null description', async () => {
    // Create a test video project with null description
    const insertResult = await db.insert(videoProjectsTable)
      .values({
        name: 'Project Without Description',
        description: null
      })
      .returning()
      .execute();

    const createdProject = insertResult[0];

    const input: GetVideoProjectInput = {
      id: createdProject.id
    };

    const result = await getVideoProject(input);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdProject.id);
    expect(result!.name).toEqual('Project Without Description');
    expect(result!.description).toBeNull();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });
});
