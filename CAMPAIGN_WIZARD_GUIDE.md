# Campaign Creation Wizard - User Guide

## 🎯 How to Create a Campaign

The campaign creation wizard walks you through 6 simple steps to launch your email campaign.

---

## Step-by-Step Guide

### Step 1: Campaign Information
Fill in basic campaign details:
- **Campaign Name** (required): Give your campaign a meaningful name
- **Company Description**: Describe your company briefly
- **Product/Service**: What are you promoting?
- **Offer**: Your value proposition or special offer
- **Campaign Goal**: Select from:
  - Lead Generation
  - Sales
  - Partnership
  - Feedback
  - Brand Awareness

**Tip**: Be specific and clear - this information helps AI generate better emails!

---

### Step 2: Target Audience
Define who you want to reach:
- **Industries**: Select one or more (Technology, Healthcare, Finance, etc.)
- **Job Roles**: Choose decision-makers (CEO, CTO, VP Engineering, etc.)
- **Company Sizes**: Select company employee ranges
- **Target Locations**: Enter comma-separated locations

**Example**: Technology startups (51-200 employees) in United States, Canada

---

### Step 3: Upload Contacts
Upload your contact list via CSV:

**CSV Format Requirements**:
- File must be `.csv` format
- Required columns: `name`, `email`, `company`, `role`
- Column headers can be uppercase or lowercase

**Sample CSV**:
```csv
name,email,company,role
John Smith,john.smith@techcorp.com,TechCorp Inc,CTO
Sarah Johnson,sarah.j@startupxyz.io,Startup XYZ,VP Product
```

**Download Sample**: [sample-contacts.csv](/sample-contacts.csv)

**What Happens**:
- ✅ CSV is parsed automatically
- ✅ Emails are validated
- ✅ Statistics shown (Total, Valid, Invalid)
- ✅ Preview of first 5 contacts displayed

**Tip**: Ensure all emails are valid business emails for best deliverability!

---

### Step 4: AI Email Generation
Generate personalized email content:

1. **Click "Generate with AI"**: Creates email template automatically based on your campaign info
2. **Review Generated Content**:
   - Email subject line
   - Email body with personalization
3. **Edit as Needed**: Customize the message to match your voice
4. **Use Variables**: 
   - `{{firstName}}` - Contact's first name
   - `{{company}}` - Contact's company
   - `{{role}}` - Contact's job role

**Live Preview**: See how your email will look with sample data

**Example Output**:
```
Subject: Transform your team's productivity with AI

Hi {{firstName}},

I noticed {{company}} is scaling fast in the tech space.

Our AI-powered platform helps teams like yours achieve:
✓ 40% faster delivery
✓ Reduced operational costs
✓ Improved team collaboration

Interested in a quick 15-min demo?

Best regards,
Your Team
```

---

### Step 5: Validation
Automated spam and deliverability check:

**Metrics Shown**:
- **Spam Score**: 0-100 (lower is better)
- **Risk Level**: Low / Medium / High
- **Deliverability**: Predicted inbox rate (%)
- **Predicted Open Rate**: Industry average estimate

**Issues Detection**:
- Spam trigger words (FREE, CLICK HERE, etc.)
- Missing personalization
- Invalid email addresses

**What to Do**:
- ✅ **Low Risk**: You're good to go!
- ⚠️ **Medium Risk**: Review and fix issues
- 🚫 **High Risk**: Revise email content

---

### Step 6: Launch Configuration
Set up sending schedule:

**Configuration**:
- **Sender Email**: Your from address
- **Start Date**: When to begin sending
- **Email Gap** (minutes): Time between each email (recommended: 3-5 min)
- **Daily Limit**: Max emails per day (recommended: 50-100)

**Campaign Summary**: Review all details before launch
- Campaign name
- Total contacts
- Valid emails
- Spam risk level

**Click "Launch Campaign"**: Your campaign starts!

---

## 📋 Pre-Flight Checklist

Before launching, ensure:
- [ ] Campaign name is descriptive
- [ ] CSV uploaded with valid emails
- [ ] Email content personalized
- [ ] Spam score is Low
- [ ] Sender email is correct
- [ ] Daily limits are reasonable

---

## ✨ Pro Tips

### Better Email Performance
1. **Personalize**: Use all available variables
2. **Keep it Short**: 150-200 words ideal
3. **Clear CTA**: One primary call-to-action
4. **Test First**: Send to yourself before launching

### Avoid Spam Filters
- Don't use ALL CAPS
- Avoid trigger words (FREE, URGENT, ACT NOW)
- Include unsubscribe link
- Use business email (not @gmail.com)
- Warm up new domains gradually

### Optimal Settings
- **Email Gap**: 3-5 minutes (looks more natural)
- **Daily Limit**: 50-100 (prevents spam flags)
- **Best Send Times**: Tuesday-Thursday, 10 AM - 2 PM

---

## 🔄 During the Campaign

Once launched:
- Monitor from **Dashboard**
- Track metrics in real-time
- View detailed stats in **Campaign Details**
- Pause/Resume anytime if needed

---

## 🎉 You're Ready!

Click "Create Campaign" from the Campaigns page to start the wizard.

The entire process takes just 5-10 minutes!
