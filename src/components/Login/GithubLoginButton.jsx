import { FaGithub } from 'react-icons/fa';

export default function GithubLoginButton() {

    return (
        <button
            className="font-mono font-normal bg-black text-[13px] text-white flex items-center justify-center px-4 py-2 rounded-md 
            shadow hover:bg-gray-800 transition">
            <FaGithub className="mr-2" />
            Login with GitHub
        </button>
    );
}