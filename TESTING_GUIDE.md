# 🧪 Testing Guide - Campaign Wizard

## ✅ How to Test the Complete Wizard

Follow these steps to verify the campaign creation wizard is working end-to-end:

---

## Prerequisites
- Dev server running: `npm run dev`
- Browser open at: `http://localhost:5173`

---

## Test Flow

### 1. Login
1. Open `http://localhost:5173`
2. Enter any email (e.g., `test@example.com`)
3. Enter any password (e.g., `password123`)
4. Click "Sign In"
5. **✅ Expected**: Redirects to Dashboard

---

### 2. Navigate to Campaign Creation
1. Click "Campaigns" in sidebar
2. Click "Create Campaign" button (top right)
3. **✅ Expected**: Wizard Step 1 loads with form

---

### 3. Step 1: Campaign Information
Fill in the form:
- **Campaign Name**: `Test Campaign - Q1 2026`
- **Company Description**: `Leading SaaS provider in project management`
- **Product/Service**: `AI-powered project management platform`
- **Offer**: `30% off for early adopters`
- **Campaign Goal**: Select `Lead Generation`

**Actions**:
- Click "Next"

**✅ Expected**:
- Form data saves
- Progress indicator shows Step 1 complete (green checkmark)
- Step 2 loads (not blank!)

---

### 4. Step 2: Target Audience
Select options:
- **Industries**: Check `Technology`, `Finance`
- **Job Roles**: Check `CTO`, `VP Engineering`, `Product Manager`
- **Company Sizes**: Check `51-200`, `201-500`
- **Locations**: Type `United States, Canada`

**Actions**:
- Click "Next"

**✅ Expected**:
- Selections save
- Progress indicator shows Step 2 complete
- Step 3 loads with upload interface

---

### 5. Step 3: Upload Contacts
**Option A: Use Sample CSV**
1. Open a new tab: `http://localhost:5173/sample-contacts.csv`
2. Save the file
3. Click "Drag and drop or click to upload"
4. Select the downloaded CSV file

**Option B: Create Your Own CSV**
Create a file `test-contacts.csv`:
```csv
name,email,company,role
Alice Johnson,alice@example.com,Example Corp,CEO
Bob Smith,bob@test.io,Test Inc,CTO
Charlie Brown,charlie@demo.com,Demo LLC,VP Engineering
```

Upload the file.

**Actions**:
- Click "Next" after upload

**✅ Expected**:
- Stats show: Total (5 or 3), Valid (5 or 3), Invalid (0)
- Preview table displays first 5 contacts
- All emails marked as "Valid" (green badge)
- Step 4 loads

---

### 6. Step 4: Email Generation
**Actions**:
1. Click "Generate with AI" button
2. Wait 1-2 seconds (simulated generation)
3. Review generated subject and body
4. Optionally edit the content

**✅ Expected**:
- Subject line generates (e.g., "Transform your team's productivity with AI")
- Email body generates with variables `{{firstName}}`, `{{company}}`, `{{role}}`
- Live preview shows sample with real names
- Click "Next"

---

### 7. Step 5: Validation
**Auto-runs on load**

**✅ Expected**:
- Validation runs automatically (loading spinner, ~1-2 seconds)
- Three metric cards show:
  - Spam Risk: "LOW" (green)
  - Deliverability: 85-100%
  - Predicted Open Rate: 50-70%
- Green success alert: "Your campaign looks great! Ready to launch."
- Click "Next"

---

### 8. Step 6: Launch Configuration
Review and configure:
- **Sender Email**: Update to your email (e.g., `you@company.com`)
- **Start Date**: Today's date (or select future date)
- **Email Gap**: `5` minutes
- **Daily Limit**: `100` emails

**Campaign Summary Shows**:
- Campaign Name: `Test Campaign - Q1 2026`
- Total Contacts: `5` (or your count)
- Valid Emails: `5`
- Spam Risk: `low` (green badge)

**Actions**:
- Click "Launch Campaign" button

**✅ Expected**:
- Button shows "Launching..." for 1 second
- Automatically redirects to `/campaigns`
- New campaign appears in the list
- Campaign card shows:
  - Name: "Test Campaign - Q1 2026"
  - Status: "Running" (green badge)
  - Contacts: 5
  - Stats: 0 sent (just launched)

---

## ✅ Verification Checklist

After completing all steps:

### Navigation
- [ ] All 6 steps accessible via Next/Previous buttons
- [ ] Progress indicator updates correctly
- [ ] No blank pages when navigating
- [ ] "Back to Campaigns" button works

### Data Persistence
- [ ] Form data persists when going back
- [ ] Save Draft button saves to localStorage
- [ ] Data flows through all steps
- [ ] Campaign appears in list after launch

### UI/UX
- [ ] All form fields render correctly
- [ ] Checkboxes work in Step 2
- [ ] CSV upload processes correctly
- [ ] AI generation shows loading state
- [ ] Validation cards display properly
- [ ] Launch summary shows accurate data

### Errors
- [ ] No console errors
- [ ] No blank pages
- [ ] No broken styles
- [ ] CSV validation works

---

## 🐛 Common Issues & Fixes

### Blank Page on Step 2
**Issue**: Missing CSS import
**Fix**: Already fixed - Step2 now imports WizardSteps.css

### CSV Upload Fails
**Issue**: Wrong format or missing columns
**Fix**: Use provided sample CSV or ensure columns: name, email, company, role

### Launch Fails
**Issue**: Missing required data
**Fix**: Fill all required fields in Steps 1-3

---

## 🎯 Success Criteria

**The test passes if**:
1. ✅ All 6 steps load without blank pages
2. ✅ Form data persists through navigation
3. ✅ CSV uploads and validates correctly
4. ✅ Campaign launches successfully
5. ✅ New campaign appears in list
6. ✅ No console errors

---

## 📸 Expected Screenshots

**Step 1**: Form with inputs
**Step 2**: Checkboxes grid
**Step 3**: Upload area + stats + preview table
**Step 4**: Email editor + preview
**Step 5**: Validation cards (3 metrics)
**Step 6**: Launch config + summary

All should render properly with no blank areas!

---

## ✅ Test Complete!

If all steps pass, the campaign wizard is fully functional! 🎉
