# Step 1 — Create a project folder

```bash
mkdir node-ts-practice
cd node-ts-practice
```

---

# Step 2 — Create package.json

```bash
npm init -y
```

---

# Step 3 — Install TypeScript and Node types

```bash
npm install -D typescript @types/node
```

- typescript → gives you the tsc compiler
- @types/node → tells TypeScript about Node.js things like **process, path, fs**

---

# Step 4 — Install tsx

```bash
npm install -D tsx
```

---

# Step 5 — Create your TypeScript file

```js

```

---

# Step 6 — Create tsconfig.json

```bash
npx tsc --init
```

---

# Step 7 — Configure tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "strict": true
  }
}
```

---

# Step 8 — Run your .ts file

```bash
npx tsx app.ts ./test
```

# What about tsc?

- tsx → Run TypeScript directly
- tsc → Compile TypeScript into JavaScript

