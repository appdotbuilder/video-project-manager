
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { getVideoProjects } from '../handlers/get_video_projects';

describe('getVideoProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no projects exist', async () => {
    const result = await getVideoProjects();

    expect(result).toEqual([]);
  });

  it('should return all video projects', async () => {
    // Create test data
    await db.insert(videoProjectsTable)
      .values([
        {
          name: 'Test Project 1',
          description: 'First test project'
        },
        {
          name: 'Test Project 2',
          description: null
        },
        {
          name: 'Test Project 3',
          description: 'Third test project'
        }
      ])
      .execute();

    const result = await getVideoProjects();

    expect(result).toHaveLength(3);
    
    // Verify first project
    expect(result[0].name).toEqual('Test Project 1');
    expect(result[0].description).toEqual('First test project');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);

    // Verify second project with null description
    expect(result[1].name).toEqual('Test Project 2');
    expect(result[1].description).toBeNull();
    expect(result[1].id).toBeDefined();
    expect(result[1].created_at).toBeInstanceOf(Date);
    expect(result[1].updated_at).toBeInstanceOf(Date);

    // Verify third project
    expect(result[2].name).toEqual('Test Project 3');
    expect(result[2].description).toEqual('Third test project');
    expect(result[2].id).toBeDefined();
    expect(result[2].created_at).toBeInstanceOf(Date);
    expect(result[2].updated_at).toBeInstanceOf(Date);
  });

  it('should return projects ordered by id', async () => {
    // Create test data
    await db.insert(videoProjectsTable)
      .values([
        { name: 'Project A', description: 'Description A' },
        { name: 'Project B', description: 'Description B' },
        { name: 'Project C', description: 'Description C' }
      ])
      .execute();

    const result = await getVideoProjects();

    expect(result).toHaveLength(3);
    
    // Verify ordering by checking ids are ascending
    for (let i = 1; i < result.length; i++) {
      expect(result[i].id).toBeGreaterThan(result[i-1].id);
    }
  });
});
