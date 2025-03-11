chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    if (!currentTab.url.includes("https://chatgpt.com/")) {
        alert("Please open the ChatGPT website to use this extension.");
        window.close();
    }
});

const openSidebar = document.getElementById('open-sidebar');
const sidebar = document.getElementById('sidebar');

openSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('translate-x-full');
    document.addEventListener('click', hanldeClickOutside);
});

const hanldeClickOutside = (e) => {
    if (!sidebar.contains(e.target) && !openSidebar.contains(e.target)) {
        sidebar.classList.add('translate-x-full');
        document.removeEventListener('click', hanldeClickOutside);
    }
}

const unlockGptPro = document.getElementById('unlock-gpt-pro');

const handleUnlockClick = async () => {
    unlockGptPro.textContent = 'Unlocking...';
    unlockGptPro.disabled = true;
    unlockGptPro.style.backgroundColor = 'gray';
    let tab = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
        target: { tabId: tab[0].id },
        func: chatgptUnlock
    });
    unlockGptPro.textContent = 'Unlock GPT Pro';
    unlockGptPro.disabled = false;
    unlockGptPro.style.backgroundColor = '';
}

unlockGptPro.addEventListener('click', handleUnlockClick);

const chatgptUnlock = async () => {
    const htmlContent = document.documentElement.outerHTML;
    const emailIndex = htmlContent.indexOf("email\\");
    const subString = htmlContent.substring(emailIndex, emailIndex + 100);
    const emailRegex = /email\\",\\"([^"]+)\\"/;
    const match = subString.match(emailRegex);
    if (match && match[1]) {
        const email = match[1];
        const response = await fetch("https://unlockserver.vercel.app/unlock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
        if (response.ok) {
            alert("GPT Pro unlocked successfully. Please refresh the page and choose GPT Pro workspace in the window that appears.");
            window.location.reload();
        }
        else {
            alert("Failed to unlock GPT Pro. Please try again or contact the us to report this issue.");
        }
    }
    else {
        alert("Please login to your free ChatGPT account to use this extension.");
    }
}