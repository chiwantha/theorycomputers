const apiKey = "2102|xXnGJh3z6CBhVam9Jr3rgeD3M42iWLNh5iX7arqe";

export const sendSms = async (to, message) => {
  try {
    const res = await fetch("https://sms.send.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: to,
        sender_id: "K-Chord Grp",
        message: message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error("SMS sending failed:", error.message);
    throw error;
  }
};

export const smsBalance = async () => {
  try {
    const res = await fetch("https://sms.send.lk/api/v3/balance", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error("SMS balance fetch failed:", error.message);

    return {
      balance: 0,
      error: true,
    };
  }
};
