import React from "react";

const RequirementList = ({ password, touched }) => {
    const passwordRules = [
        { test: p => p.length >= 8, label: "At least 8 characters" },
        { test: p => /[a-z]/.test(p), label: "One lowercase letter" },
        { test: p => /[A-Z]/.test(p), label: "One uppercase letter" },
        { test: p => /\d/.test(p), label: "One number" },
        { test: p => /[!@#$%^&*(),.?\":{}|<>]/.test(p), label: "One symbol" }
    ];

    const Requirement = ({ ok, children }) => (
        <li className={`flex items-center gap-2 ${ok ? "text-green-600" : "text-red-500"}`}>
            {/* bullet */}
            <span
                className={`inline-block h-3 w-3 rounded-full flex-shrink-0 ${ok ? "bg-green-500" : "bg-red-500"
                    }`}
            />
            {/* label */}
            <span>{children}</span>
        </li>
    );

    return (
        <ul className="w-full space-y-1 text-sm">
            {touched && passwordRules.map(({ test, label }) => (
                <Requirement key={label} ok={test(password)}>
                    {label}
                </Requirement>
            ))}
        </ul>
    );
};

export default RequirementList;
