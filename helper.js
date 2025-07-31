import db from "./config/firebaseAdmin.js";

export const createTaskHandler = async ({ title, description, assignee, status }) => {
  try {
    const sectionSnapshot = await db.collection("sections").get();
    const userSnapshot = await db.collection("users").get();


    let matchedSectionId = null;
    let matchedUserId = null

    userSnapshot.forEach(doc => {
      const data = doc.data();
      if (`${data.firstName} ${data.lastName}`.toLowerCase() === assignee.toLowerCase()) {
        matchedUserId = doc.id;
      }
    });

    sectionSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status && data.status.toLowerCase() === status.toLowerCase()) {
        matchedSectionId = doc.id;
      }
    });

    if (!matchedSectionId) {
      throw new Error(`No section found with status "${status}"`);
    }

    if (!matchedUserId) {
      throw new Error(`No user found "${assignee}"`);
    }
    const newTaskRef = db.collection("tasks").doc();
    const taskId = newTaskRef.id;

    const task = {
      taskId,
      title,
      description,
      assignedTo: matchedUserId,
      sectionId: matchedSectionId,
    };

    await newTaskRef.set(task);

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