export const jobTemplates = {
  CREATE: (data) => `
    Hello ${data.customerName},

Your job has been created successfully.

Job No : ${data.jobNo}
Status: Pending to Start

Thank you !
    `,
  STARTED: (data) => `
Hello ${data.customerName},

Work on your job has started.

Job No : ${data.jobNo}
Status: In Progress

We will notify you once the work is completed.

Thank you !
`,
  RESTARTED: (data) => `
Hello ${data.customerName},

Work on your job has been restarted.

Job No : ${data.jobNo}
Status: In Progress

We will notify you once the work is completed.

Thank you !
`,
  FINISHED: (data) => `
    Hello ${data.customerName},

Your job ${data.jobNo} has been completed and is ready for collection.

Total: Rs. ${data.netTotal}

Thank you !
    `,
  CANCELLED: (data) => `
    Your job has been cancelled.

Job No : ${data.jobNo}
Reason: ${data.reason}

Please contact us if you need more information.

Thank you.
    `,
};
