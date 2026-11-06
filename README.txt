OMAR — CYBERSECURITY & CLOUD SECURITY PORTFOLIO (the honest edition)
====================================================================

HOW TO OPEN IT
1. Unzip this folder anywhere.
2. Double-click index.html. It opens in your browser. No install needed.
   (You need internet once so Tailwind CSS and the fonts can load.)

FILES
- index.html : all the page content (About, Skills, Projects, footer, game overlay)
- styles.css : the look, plus the subtle "alive" animations
- app.js     : the interactions and the hidden Tech Detective game
- README.txt : this file

THINGS TO DO FIRST (open the files in VS Code)
1. PHOTO: save your shot put photo as  shotput.jpg  in this same folder.
   It appears automatically in the Achievements card AND in the secret final reveal.
   Until then, a placeholder shows instead.
2. REPO LINKS: the four "Side quests" cards (Mesh Manager, UniBuddy, Football App,
   Football Club App) currently link to https://github.com/hillomar.
   In index.html, search for  github.com/hillomar  and change each one to the exact
   repo link, for example https://github.com/hillomar/your-repo-name
   Also edit each card's short description so it says what the app really does.
3. EMAIL: there is no email button yet. If you want one, add this next to the LinkedIn
   button in the footer of index.html:
   <a class="btn-ghost !py-2 !px-4" href="mailto:YOUR_EMAIL">Email</a>
4. TRYHACKME: the footer links to https://tryhackme.com/p/hillomar. Check it opens your profile.
5. As you really learn things, update the Skills cards (change LOCKED to IN PROGRESS and
   edit the text) and turn the "coming soon" project cards into real ones.

THE HIDDEN GAME (spoiler!)
- Click the 3 hidden clues in order: the dotted word "reconnaissance" in About,
  the faint diamond symbol in the Skills intro, and the word "payload" in the first
  security project card.
- A small trace.log panel appears and prints the passcode: TRUST-NO-ONE
- Type it into the little console in the footer to open the dossier with 3 riddles.
- Riddle answers: firewall, iam, sqli
- Change the passcode, riddles and answers at the top of app.js (the CONFIG block).

FREE HOSTING (optional)
Drag the folder onto Netlify Drop (app.netlify.com/drop) or turn on GitHub Pages
to get a public link for your portfolio.

MOTION
All the floating and jiggle effects switch off automatically for visitors who have
"reduce motion" turned on in their device settings.
