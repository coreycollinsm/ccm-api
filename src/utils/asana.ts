import { asanaGIDs } from "../config/asana";

// The `asana` package does not ship TS declarations in this project setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Asana = require("asana");

// Structure of the input
interface CreateContactAsanaTaskInput {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

const getAsanaClient = () => {
  const accessToken = process.env.ASANA_PERSONAL_ACCESS_TOKEN;
  const endpoint = "https://app.asana.com/api/1.0";

  if (!accessToken) {
    throw new Error("Missing ASANA_PERSONAL_ACCESS_TOKEN in env");
  }

  const client = Asana.ApiClient.instance;
  client.authentications.token.accessToken = accessToken;
  client.basePath = endpoint;

  return new Asana.TasksApi(client);
};

export const createContactAsanaTask = async (
  input: CreateContactAsanaTaskInput,
): Promise<void> => {
  const tasksApi = getAsanaClient();
  const originOptionGID = asanaGIDs.originGIDs["ccm"];

  const customFields: Record<string, string> = {
    [asanaGIDs.fieldGIDs.firstName]: input.firstName,
    [asanaGIDs.fieldGIDs.lastName]: input.lastName,
    [asanaGIDs.fieldGIDs.email]: input.email,
    [asanaGIDs.fieldGIDs.company]: input.company,
    [asanaGIDs.fieldGIDs.origin]: originOptionGID, // ENUM dropdown in Asana
  };

  await tasksApi.createTask({
    data: {
      workspace: asanaGIDs.orgGID,
      projects: [asanaGIDs.projectGID],
      name: `New contact submission from ${input.firstName} ${input.lastName}`, // Dynamic task title
      notes: input.message,
      custom_fields: customFields,
    },
  });
};
