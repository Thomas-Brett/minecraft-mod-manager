"use client";
import { CgSpinner } from "react-icons/cg";
import { ButtonTypes } from "./types";
import React from "react";

interface Props {
    type?: ButtonTypes;
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    loading?: boolean;
    loadingText?: string;
    active?: boolean;
}

export default function Button({
    type = "default",
    className = "",
    onClick = () => {},
    children = "",
    loading = false,
    loadingText = "Loading...",
    active = true,
}: Props) {
    className += " px-3 py-1 rounded-lg text-lg cursor-pointer transition-colors duration-200 ease-in-out drop-shadow ";

    switch (type) {
        case "default":
            className += "bg-accent text-white " + (active ? "hover:bg-accent-hover " : "");
            break;
        case "alternate":
            className += "bg-transparent text-white border border-white hover:bg-white hover:bg-opacity-20 ";
            break;
    }

    switch (active) {
        case true:
            className += "opacity-100 ";
            break;
        case false:
            className += "opacity-50 cursor-not-allowed ";
            break;
    }

    return (
        <button className={className} onClick={onClick} {...(loading ? { disabled: true } : {})}>
            {loading ? (
                <>
                    <CgSpinner className="inline animate-spin text-xl" />
                    <span className="ml-2">{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
