import React from "react";
import { Separator } from "@/components/ui/separator";
import { MapPin, LinkIcon, Calendar, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import GithubAnalyticsWidget from "@/components/shared/GithubAnalyticsWidget";
import Image from "next/image";
import { Metadata } from "next";

interface Props {
  params: { username: string };
}

async function getGithubUser(username: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_GITHUB_API_URL}/users/${username}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    return null;
  }
}

async function getGitcordUser(username: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/getProfileByUsername`,
      {
        params: { username },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching Gitcord user:", error);
    return null;
  }
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }
  return num.toString();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const githubUser = await getGithubUser(username);

  if (githubUser) {
    return {
      title: `Gitcord | ${username}'s profile`,
    };
  }

  return {
    title: `@${username} - Gitcord`,
  };
}

const ProfilePage = async ({ params }: Props) => {
  const { username } = await params;

  const [githubUser, gitcordUser] = await Promise.all([
    getGithubUser(username),
    getGitcordUser(username),
  ]);

  if (!githubUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950">
        <div className="max-w-[420px] rounded-2xl w-full mx-auto border border-neutral-800 shadow-lg bg-neutral-900 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative w-full h-24">
            <div
              className="absolute top-0 left-0 w-full h-24 rounded-t-2xl z-0"
              style={{
                background: "linear-gradient(135deg, #2d7d46 0%, #1b1f23 100%)",
                backgroundImage:
                  "radial-gradient(circle at 100% 0%, rgba(45, 125, 70, 0.8) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(27, 31, 35, 0.8) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-neutral-100">
                User Not Found
              </h2>
              <p className="text-sm text-neutral-400 max-w-sm">
                The GitHub user "{username}" could not be found. Please check
                the username and try again.
              </p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

            <div className="flex flex-col items-center gap-4">
              <div className="text-xs text-neutral-500">
                Make sure the username is correct and the user exists on GitHub.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950">
      <div className="max-w-[420px] rounded-2xl w-full mx-auto border border-neutral-800 shadow-lg bg-neutral-900 overflow-visible">
        {/* Banner ve Profil Fotoğrafı */}
        <div className="relative w-full h-24">
          <div
            className="absolute top-0 left-0 w-full h-24 rounded-t-2xl z-0"
            style={{
              background: "linear-gradient(135deg, #2d7d46 0%, #1b1f23 100%)",
              backgroundImage:
                "radial-gradient(circle at 100% 0%, rgba(45, 125, 70, 0.8) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(27, 31, 35, 0.8) 0%, transparent 50%)",
            }}
          />
          {/* View Count */}
          {gitcordUser && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-neutral-100">
              <Eye className="w-4 h-4 font-semibold" />
              <span className="text-sm font-semibold">
                {formatNumber(gitcordUser.stats?.view_count || 0)}
              </span>
            </div>
          )}
          {/* Profile Picture */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="rounded-full w-24 h-24 border border-neutral-800 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden bg-neutral-900">
              <img
                src={githubUser.avatar_url}
                alt={githubUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        {/* Kart içeriği */}
        <div className="flex flex-col gap-4 p-4 mt-12">
          {/* Profile info */}
          <div className="grid gap-4 px-4 py-4 rounded-xl bg-neutral-950">
            <div className="flex items-start justify-between">
              <div className="grid gap-1">
                <div className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  {githubUser.name || githubUser.login}
                </div>
                <div className="text-sm text-neutral-400">
                  @{githubUser.login}
                </div>
              </div>
              {gitcordUser && (
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="p-0.5 rounded-full text-neutral-950 transition-colors">
                          <Image
                            src="/member-card.png"
                            alt="Gitcord Logo"
                            width={20}
                            height={20}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gitcord Member</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {gitcordUser.isModerator && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-0.5 rounded-full text-[#ED4245] transition-colors">
                            <Image
                              src="/banner.png"
                              alt="Moderator"
                              width={20}
                              height={20}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Moderator</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {gitcordUser.premium?.isPremium && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-0.5 rounded-full text-[#FEE75C] transition-colors">
                            <Image
                              src="/premium.png"
                              alt="Premium"
                              width={20}
                              height={20}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Premium</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {gitcordUser.stats?.view_count > 1000 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-0.5 rounded-full transition-colors">
                            <Image
                              src="/fire.png"
                              alt="Popular"
                              width={20}
                              height={20}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hype!!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-neutral-800" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-neutral-100">
                  {githubUser.public_repos}
                </div>
                <div className="text-xs text-neutral-400">Repositories</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-neutral-100">
                  {githubUser.followers}
                </div>
                <div className="text-xs text-neutral-400">Followers</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-neutral-100">
                  {githubUser.following}
                </div>
                <div className="text-xs text-neutral-400">Following</div>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            {/* About */}
            <div className="grid gap-2">
              <div className="text-xs font-bold uppercase text-neutral-100">
                About
              </div>
              <div className="text-sm text-neutral-400">
                {githubUser.bio || "No bio provided."}
              </div>
            </div>

            {/* Details */}
            <div className="grid gap-3">
              {githubUser.location && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <MapPin className="w-4 h-4" />
                  {githubUser.location}
                </div>
              )}
              {githubUser.blog && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={githubUser.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {githubUser.blog}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Calendar className="w-4 h-4" />
                Joined {new Date(githubUser.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <GithubAnalyticsWidget />
    </div>
  );
};

export default ProfilePage;
