import db from "./config/firebaseAdmin.js";

export const createTaskHandler = async ({ title, description, assignee, status }) => {
  try {
    const snapshot = await db.collection("sections").get();

    let matchedSectionId = null;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status && data.status.toLowerCase() === status.toLowerCase()) {
        matchedSectionId = doc.id;
      }
    });

    if (!matchedSectionId) {
      throw new Error(`No section found with status "${status}"`);
    }

    const task = {
      title,
      description,
      assignedTo: "U9FIeQ7h1uXvjsFYtkzjTvxGZpi1",
      sectionId: matchedSectionId,
    };

    console.log('task :>> ', task);

    await db.collection("tasks").add(task);

    return {
      content: [
        {
          type: "text",
          text: `Task "${title}" created for ${assignee} in section "${status}".`
        }
      ]
    };
  } catch (error) {
    console.error("createTaskHandler error:", error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to create task: ${error.message}`
        }
      ]
    };
  }
};

export const subtractTwoNumber = async ({ a, b }) => {
  const result = a - b;
  console.log(`subtracting ${a} - ${b} = ${result}`);
  return {
    content: [{ type: "text", text: String(result) }]
  };
}