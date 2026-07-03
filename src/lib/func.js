const apiKey = "2102|xXnGJh3z6CBhVam9Jr3rgeD3M42iWLNh5iX7arqe";

export const sendSms = async (to, message) => {
  const phone = String(to).trim();

  // Ignore if phone is 0
  if (phone === "0") {
    return {
      success: false,
      message: "Phone number is 0. SMS not sent.",
    };
  }

  // Validate Sri Lankan mobile number
  if (!/^07\d{8}$/.test(phone)) {
    return {
      success: false,
      message: "Invalid Sri Lankan mobile number.",
    };
  }

  try {
    const res = await fetch("https://sms.send.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: phone,
        sender_id: "K-Chord Grp",
        message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "SMS sending failed.",
      };
    }

    return {
      success: true,
      message: "SMS sent successfully.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Unexpected error while sending SMS.",
    };
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
