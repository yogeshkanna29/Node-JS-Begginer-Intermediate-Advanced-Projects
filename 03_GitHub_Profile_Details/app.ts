const userName = process.argv[2];

function printError(message: string) {
  console.error(`error - ${message}`);
  process.exitCode = 1;
}

interface gitHubProfile {
  name: string;
  login: string;
  html_url: string;
  public_repos: string;
  followers: string;
}

function printProfile(profile: gitHubProfile) {
  console.log(`Name: ${profile.name || "not set"}`);
  console.log(`Username: ${profile.login}`);
  console.log(`Profile: ${profile.html_url}`);
  console.log(`Public repos: ${profile.public_repos}`);
  console.log(`Followers: ${profile.followers}`);
}

async function fetchGithubProfile(userName: Pick<gitHubProfile, "name">) {
  const url = `https://api.github.com/users/${encodeURIComponent(userName?.name)}`;

  let response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "github-profile-cli",
      },
    });
  } catch {
    printError("Could not reach Github");
    return null;
  }

  const data = await response.json().catch(() => null);

  if (response.status === 404) {
    printError(`GitHub user not found: ${userName}`);
    return null;
  }

  if (!response.ok) {
    printError(
      data?.message || `GitHub request failed with status ${response.status}`,
    );
    return null;
  }
  return data;
}

async function main() {
  if (!userName) {
    printError("please provide a GitHub username");
    return;
  }

  const profile = await fetchGithubProfile({ name: userName });

  if (!profile) {
    return;
  }

  printProfile(profile);
}

await main();
