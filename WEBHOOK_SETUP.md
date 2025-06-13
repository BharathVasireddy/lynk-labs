# WhatsApp Webhook Setup Guide

## 🌐 Configure Webhook URL in Meta Developer Console

### Step 1: Access Meta Developer Console
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Select your app: "Lynk Labs WhatsApp" (App ID: 2627933704064507)
3. Navigate to **WhatsApp** → **Configuration**

### Step 2: Set Webhook URL
1. In the **Webhook** section, click **Edit**
2. Set **Callback URL**: `https://lynk-labs-oc9f9g9ek-bharats-projects-f5c67a7b.vercel.app/api/webhooks/whatsapp`
3. Set **Verify Token**: `lynk-labs-webhook-secure-token-2024`
4. Click **Verify and Save**

### Step 3: Subscribe to Webhook Fields
Select these webhook fields:
- ✅ **messages** (for incoming messages)
- ✅ **message_deliveries** (for delivery status)
- ✅ **message_reads** (for read receipts)

### Step 4: Test Webhook
Meta will send a verification request to your webhook URL. Our endpoint will automatically respond with the challenge.

### Step 5: Verify Setup
1. Send a test message to your WhatsApp business number
2. Check Vercel logs for webhook events
3. Verify message delivery status tracking

## 🔍 Troubleshooting

### Common Issues:
1. **Webhook Verification Failed**
   - Ensure the URL is accessible: `https://your-domain.com/api/webhooks/whatsapp`
   - Verify token matches: `lynk-labs-webhook-secure-token-2024`

2. **SSL Certificate Error**
   - Webhook URL must use HTTPS
   - Vercel provides SSL automatically

3. **Webhook Not Receiving Events**
   - Check webhook subscriptions are enabled
   - Verify app is in production mode (not development)

## ✅ Current Configuration

- **Webhook URL**: `https://lynk-labs-oc9f9g9ek-bharats-projects-f5c67a7b.vercel.app/api/webhooks/whatsapp`
- **Verify Token**: `lynk-labs-webhook-secure-token-2024`
- **App ID**: `2627933704064507`
- **Phone Number**: `+91 72070 53418`

## 🎯 After Setup

Once webhook is configured:
1. **Message Status Tracking**: See delivery/read status in logs
2. **Customer Support**: Automated responses to "HELP", "STATUS", etc.
3. **Two-way Communication**: Handle customer replies
4. **Analytics**: Track message engagement

**🎉 Your WhatsApp Business API is production-ready!** 