import React, { useEffect, useState } from 'react'
import validator from "validator"
import RequirementList from './RequirementList';

const PasswordValidator = () => {
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState(false);

    const isValid = validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })

    return (
        <div className="flex flex-col items-center mx-auto gap-6 p-6 max-w-sm">
            <h2 className='font-semibold text-2xl'>Create a secure password</h2>
            <input
                type="password"
                className={`
                            w-full rounded-xl p-3 shadow transition
                            focus:outline-none focus:ring-2
                            ${touched ? (isValid ? "ring-green-500" : "ring-red-500") : ""}
                        `}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setTouched(true)}
                onBlur={() => setTouched(false)}
            />


            <RequirementList password={password} touched={touched}/>

            <button
                className='w-full rounded-xl py-2 font-semibold text-white shadow
                       transition disabled:opacity-50 disabled:cursor-not-allowed
                       bg-gradient-to-r from-indigo-500  to-purple-500'
                disabled={!isValid}
                onClick={() => alert("Password accepted")}
            >
                Sign Up
            </button>
        </div>
    )
}

export default PasswordValidator