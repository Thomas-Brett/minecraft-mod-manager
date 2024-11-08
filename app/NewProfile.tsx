"use client";
import React from "react-dom";
import { FaCheck, FaPlus, FaX } from "react-icons/fa6";
import Input from "@/app/common/Input";
import { useEffect, useState } from "react";
import Button from "@/app/common/Button";
const invoke = window.__TAURI__.core.invoke;

export default function NewProfile() {
    const loaders = ["vanilla", "fabric"];

    const [currentLoader, setCurrentLoader] = useState<string>("vanilla");
    const [currentGameVersion, setCurrentGameVersion] = useState<string>("");
    const [gameVersions, setGameVersions] = useState<string[]>([]);
    const [profileName, setProfileName] = useState<string>("");

    const [ready, setReady] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getGameVersions(currentLoader).then((versions) => setGameVersions(versions));
    }, [currentLoader]);

    const LoaderOptions = (
        <div className="flex">
            {loaders.map((loader) => (
                <LoaderOption key={loader} loader={loader} currentLoader={currentLoader} setLoader={setCurrentLoader} />
            ))}
        </div>
    );

    useEffect(() => {
        if (currentLoader.length && currentGameVersion.length && profileName.length) {
            if (profileName.includes("/") || profileName.includes("\\")) return setReady(false);
            setReady(true);
        } else setReady(false);
    }, [currentLoader, currentGameVersion, profileName]);

    const createProfile = async () => {
        if (!ready) return;
        setLoading(true);
        await invoke("create_profile_endpoint", {
            profileName: profileName,
            loader: currentLoader,
            version: currentGameVersion,
        });
    };

    return React.createPortal(
        <div className="absolute left-0 top-0 z-10 flex h-dvh w-dvw items-center justify-center bg-black bg-opacity-40 drop-shadow backdrop-blur-sm">
            <div className="flex min-w-[500px] flex-col overflow-hidden rounded-lg bg-primary">
                <div className="bg-dark border-dark flex h-full w-full items-center border-b border-opacity-60 px-4 py-3">
                    <h1 className="text-3xl font-bold text-light">Create New Profile</h1>
                    <FaX className="ml-auto cursor-pointer text-light" />
                </div>
                <div className="flex flex-col px-4 pb-4">
                    <h2 className="mb-2 mt-4 text-xl font-bold text-light">Profile Name:</h2>
                    <Input className="w-80" value={profileName} onChange={(e: any) => setProfileName(e.target.value)} />

                    <h2 className="mb-2 mt-4 text-xl font-bold text-light">Mod Loader:</h2>
                    {LoaderOptions}

                    <h2 className="mb-2 mt-4 text-xl font-bold text-light">Game Version:</h2>
                    <GameVersionSelect
                        currentGameVersion={currentGameVersion}
                        setCurrentGameVersion={setCurrentGameVersion}
                        gameVersions={gameVersions}
                    />

                    <div className="ml-auto mt-4 flex">
                        <Button className="mr-3" type="alternate">
                            Cancel
                        </Button>
                        <Button
                            className="flex items-center"
                            active={ready}
                            onClick={createProfile}
                            loading={loading}
                            loadingText="Creating Profile..."
                        >
                            <FaPlus className="mr-2 text-sm" />
                            <p className="align-middle">Create Profile</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document?.body,
    );
}

function GameVersionSelect({
    currentGameVersion,
    setCurrentGameVersion,
    gameVersions,
}: {
    currentGameVersion: string;
    setCurrentGameVersion: (version: string) => void;
    gameVersions: string[];
}) {
    if (!gameVersions || gameVersions.length === 0) return <div>Loading...</div>;
    return (
        <div>
            <select
                value={currentGameVersion}
                onChange={(e) => setCurrentGameVersion(e.target.value)}
                className="rounded-lg border-2 border-accent border-opacity-0 bg-panel px-2 py-1 text-lg text-light text-white drop-shadow transition-all focus:border-opacity-100 focus:outline-0"
            >
                <option value={0}>Select a version...</option>
                {gameVersions.map((version) => (
                    <option key={version} value={version}>
                        {version}
                    </option>
                ))}
            </select>
        </div>
    );
}

function LoaderOption({
    loader,
    currentLoader,
    setLoader,
}: {
    loader: string;
    currentLoader: string;
    setLoader: (loader: string) => void;
}) {
    return (
        <div
            className={
                (currentLoader === loader
                    ? "border-opacity-100 bg-accent bg-opacity-30 text-opacity-100"
                    : "border-opacity-0 bg-panel text-opacity-80 hover:scale-110 hover:bg-opacity-80") +
                " mx-2 flex cursor-pointer select-none items-center rounded-lg border border-accent px-3 py-2 text-xl text-white transition-all first-of-type:ml-0"
            }
            onClick={() => setLoader(loader)}
        >
            <FaCheck className={currentLoader === loader ? "mr-2 text-accent" : "hidden"} />
            {loader[0].toUpperCase() + loader.slice(1)}
        </div>
    );
}

async function getGameVersions(version: string) {
    switch (version) {
        case "vanilla":
            const response = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json");
            const json = await response.json();
            let versions = [];
            for (const version of json.versions) {
                if (version.type === "release") versions.push(version.id);
            }
            return versions;
        case "fabric":
            const fabricResponse = await fetch("https://meta.fabricmc.net/v2/versions/game");
            const fabricJson = await fabricResponse.json();
            let fabricVersions = [];
            for (const version of fabricJson) {
                if (version.stable) fabricVersions.push(version.version);
            }
            return fabricVersions;
    }
    return [];
}
