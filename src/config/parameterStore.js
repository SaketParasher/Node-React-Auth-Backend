import {
    SSMClient,
    GetParameterCommand
} from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({
    region: "ap-southeast-2"
});

export async function getSessionSecret() {
    const command = new GetParameterCommand({
        Name: "/node-auth/prod/session-secret",
        WithDecryption: true
    });

    const response = await ssmClient.send(command);

    if (!response.Parameter?.Value) {
        throw new Error("SESSION_SECRET not found in Parameter Store");
    }

    return response.Parameter.Value;
}