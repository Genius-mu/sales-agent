"use client";

import { useState, useEffect } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { getSupabase } from "@/lib/supabase";

const BUSINESS_ID = "3f6505b0-ac65-487e-8dee-f3b2cd9d73fa";

const PERSONAS = [
  { value: "friendly and professional", label: "Friendly & Professional" },
  { value: "direct and concise", label: "Direct & Concise" },
  { value: "enthusiastic and energetic", label: "Enthusiastic & Energetic" },
  { value: "warm and consultative", label: "Warm & Consultative" },
];

export default function SetupPage() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [persona, setPersona] = useState(PERSONAS[0].value);
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scraped, setScraped] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      const { data } = await getSupabase()
        .from("businesses")
        .select("name, website_url, agent_persona, scraped_content")
        .eq("id", BUSINESS_ID)
        .single();
      if (data) {
        setName(data.name || "");
        setUrl(data.website_url || "");
        setPersona(data.agent_persona || PERSONAS[0].value);
        if (data.scraped_content) {
          setScraped(true);
          setPreview(data.scraped_content.slice(0, 200));
        }
      }
    }
    loadBusiness();
  }, []);

  const handleScrape = async () => {
    if (!url) return;
    setError("");
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, businessId: BUSINESS_ID }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setScraped(true);
        setPreview(data.preview);
        setSuccess("Website content loaded successfully");
      }
    } catch {
      setError("Failed to scrape website. Check the URL and try again.");
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    const { error } = await getSupabase()
      .from("businesses")
      .update({ name, agent_persona: persona })
      .eq("id", BUSINESS_ID);
    if (error) {
      setError("Failed to save settings.");
    } else {
      setSuccess("Settings saved!");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <DashboardNav />
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Configure Your Agent
          </h1>
          <p className="text-zinc-400 text-sm">
            Tell the agent about your business so it can hold real sales
            conversations.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Business Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Website URL
            </label>
            <p className="text-zinc-500 text-xs mb-3">
              We'll read your site and use it to train the agent.
            </p>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <Button
                onClick={handleScrape}
                disabled={scraping || !url}
                className="whitespace-nowrap bg-blue-600 hover:bg-blue-500"
              >
                {scraping ? "Loading..." : scraped ? "Re-scrape" : "Load Site"}
              </Button>
            </div>
            {scraped && preview && (
              <div className="mt-4 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                <p className="text-xs text-green-400 font-medium mb-2">
                  ✓ Content loaded
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                  {preview}...
                </p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Agent Personality
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PERSONAS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPersona(p.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${persona === p.value ? "bg-blue-600/20 border-blue-500 text-blue-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              ✓ {success}
            </p>
          )}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-500 h-11 font-semibold"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
