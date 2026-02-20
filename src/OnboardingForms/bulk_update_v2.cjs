const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/TUSHANKAR/Desktop/Carecomp/CareComp/client/src/OnboardingForms';

const replacements = [
  {
    // Match the block I previously inserted
    find: /onClick=\{\(\) => \{ if \(window\.confirm\("Are you sure you want to exit the application process\? Any unsaved changes may be lost\."\)\) \{ window\.location\.href = "\/my-application"; \} \}\}/g,
    replace: 'onClick={() => { window.location.href = "/my-application"; }}'
  },
  {
    // Match the one in ClientInfoForm where I might have used a slightly different spacing
    find: /onClick=\{\(\) => \{\s+if \(\s+window\.confirm\(\s+"Are you sure you want to exit the application process\? Any unsaved changes may be lost\.",\s+\)\s+\) \{\s+window\.location\.href = "\/my-application";\s+\}\s+\}\}/g,
    replace: 'onClick={() => { window.location.href = "/my-application"; }}'
  }
];

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.jsx')) {
      const filePath = path.join(directory, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;

      replacements.forEach(r => {
        if (r.find.test(content)) {
          content = content.replace(r.find, r.replace);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated (simplified): ${file}`);
      }
    }
  });
});
