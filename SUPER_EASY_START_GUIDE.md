# 🕵️‍♂️ How to Run Your Super Spy Dashboard (The Easy Way)

Hi there! Ready to be a super spy and track secret sales? Follow these easy steps to start your mission. 🚀

---

## Step 1: Get Your Tools Ready 🛠️
Before we start, make sure you have these two things on your computer (ask a parent if you're not sure!):
1.  **Python** (The brain 🧠)
2.  **Node.js** (The face 😃)

---

## Step 2: The Secret Keys 🔑
We need some secret passwords to make the app work. Don't worry, I made a magic script for you!

1.  Open your **Terminal** (It looks like a hacker screen!).
2.  Type this and hit **Enter**:
    ```bash
    python finalize_deployment.py
    ```
3.  It will ask you for some keys. If you don't have them yet, just press **Enter** to skip for now.

---

## Step 3: Blast Off! 🚀
We need to start two engines: the **Backend** (Server) and the **Frontend** (Website).

### Engine 1: The Server (Backend)
1.  Open a new Terminal.
2.  Go to the backend folder:
    ```bash
    cd backend
    ```
3.  Turn it on:
    ```bash
    uvicorn app.main:app --reload
    ```
4.  If you see green text saying "Application startup complete", you are good! ✅

### Engine 2: The Website (Frontend)
1.  Open a **second** Terminal window.
2.  Go to the frontend folder:
    ```bash
    cd frontend
    ```
3.  Turn it on:
    ```bash
    npm run dev
    ```
4.  Wait until it says "Ready on http://localhost:3000". ✅

---

## Step 4: Be a Spy 🕵️‍♀️
Now for the fun part!

1.  Open your web browser (like Chrome).
2.  Go to this address: **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**
3.  **Wow!** You should see your Black & Gold Dashboard. ✨

### How to use it:
*   **Track a Store**: See the box that says "Enter Shopify URL"? Type a store name like `gymshark.com` in there and click **Track Store**. Watch the magic happen!
*   **See Sales**: Look at the "Live Sales Feed". If people are buying things, it will pop up there! 💸
*   **Export**: See a cool product? Click the **Export** button to save it (pretend) to your own store.

---

## Troubleshooting (Fixing Problems) 🔧
*   **"It's broken!"**: Did you start BOTH terminals? You need both Engine 1 and Engine 2 running at the same time.
*   **"No Data?"**: Sometimes it takes a few seconds to wake up. Be patient, young jedi!

Have fun building your empire! 👑
