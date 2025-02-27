import { useState, useEffect } from "react";
import { getLocalStorage, setLocalStorage } from "@/app/utils/localStorage";
import data from "../data/data.json";
import { getDailyMember, hashString } from "@/app/utils/utils";
import { Member } from "@/app/types/member";

export const useMembers = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [dailyMember, setDailyMember] = useState<Member | null>(null);
    const [guesses, setGuesses] = useState<Member[]>([]);
    const [guessed, setGuessed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMembers(data);
        const daily = getDailyMember(data);
        setDailyMember(daily);

        const lastGuesses = getLocalStorage<Member[]>("last_guesses", []);
        const lsd_seed = getLocalStorage<number>("lsd_seed", 0);

        const today = new Date().toISOString().split("T")[0]
        if (lsd_seed === hashString(today)) {
            setGuesses(lastGuesses || []);
            setGuessed(getLocalStorage<boolean>("guessed", false));
        }
        setLoading(false);
    }, []);

    const handleGuess = (member: Member) => {
        setGuesses((prev) => [member, ...prev]);
        setMembers((prev) => prev.filter((m) => m.name !== member.name));

        if (member.name === dailyMember?.name) {
            setGuessed(true);
            setLocalStorage("guessed", true);
        }
        setLocalStorage("lsd_seed", hashString(new Date().toISOString().split("T")[0]));
        setLocalStorage("last_guesses", [member, ...guesses]);
    };

    return { members, dailyMember, guesses, guessed, handleGuess, loading };
};
