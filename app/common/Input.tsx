export default function Input({ className = "", ...props }) {
    return (
        <input
            className={
                "rounded-lg border-2 border-accent border-opacity-0 bg-panel px-2 py-1 text-lg text-light text-white drop-shadow transition-all focus:border-opacity-100 focus:outline-0 " +
                className
            }
            {...props}
        />
    );
}
