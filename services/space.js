export const getAllSpaces = async () => {
  const result = await spaceRepo.getAllSpaces();
  console.log(result);

  if (!result) {
    throw new Error("No learning spaces created");
  }

  return result;
};

export const getSingleSpace = async (learning_space_id) => {
  const result = await spaceRepo.getSingleSpace(learning_space_id);
  if (!result) {
    throw new Error("Learning space not found");
  }

  const prerequisites = await spaceRepo.getPrerequisites(learning_space_id);

  console.log(prerequisites);
  return {
    ...result,
    prerequisites,
  };
};

export const createLearningSpace = async ({
  space_title,
  space_photo_url,
  space_description,
  user_id,
  learning_space_prerequisites,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    //  cek space_title apakah sudah  ada di  db atau belum
    const getSpaceByTitleResult = await spaceRepo.getSingleSpaceByTitle(
      space_title
    );

    if (getSpaceByTitleResult.rowCount !== 0) {
      // if (getSpaceByTitleResult.rows.length > 0) {
      console.log("err");
      throw new BadRequestError("Title is already in  use");
    }

    // repo
    const result = await spaceRepo.insertSpace(client, {
      space_title,
      space_photo_url,
      space_description,
      user_id,
    });

    const { learning_space_id } = result.rows[0];

    // Cek udah ada belum di tabel Tags yang tag_name nya == tagName
    for (const tagName of learning_space_prerequisites) {
      const existingId = await spaceRepo.getTagIdByName(client, tagName);

      if (existingId) {
        await spaceRepo.insertSpaceTag(client, {
          learning_space_id,
          tag_id: existingId.tag_id,
        });
      } else {
        const newTagId = await spaceRepo.insertTags(client, {
          tag_name: tagName,
        });

        await spaceRepo.insertSpaceTag(client, {
          learning_space_id,
          tag_id: newTagId,
        });
      }
    }

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getRelatedSpaces = async (learning_space_id) => {
  const result = await spaceRepo.getRelatedSpaces(learning_space_id);

  return result;
};
