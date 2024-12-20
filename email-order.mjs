import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

// set email
const VERIFIED_EMAIL = "<VERIFIED EMAIL>"; 

export const handler = async (event) => {
  try {

    const input = typeof event.input === "string" ? JSON.parse(event.input) : event;

    const { id, pie, quantity, customerName, deliveryDate } = input;

    // Email parameters
    const emailParams = {
      Source: `Orders <${VERIFIED_EMAIL}>`, 
      Destination: {
        ToAddresses: [VERIFIED_EMAIL], 
      },
      Message: {
        Subject: {
          Data: `Order Details for ID: ${id}`,
        },
        Body: {
          Text: {
            Data: `Order Details:\n\nID: ${id}\nPie: ${pie}\nQuantity: ${quantity}\nCustomer Name: ${customerName}\nDelivery Date: ${deliveryDate}`,
          },
        },
      },
    };

    // Send the email
    const command = new SendEmailCommand(emailParams);
    await sesClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
