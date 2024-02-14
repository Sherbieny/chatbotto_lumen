import styles from './page.module.css'; // Ensure you have this CSS file in the right place
import Link from 'next/link';
import Image from 'next/image';
import ChatWindow from '@/components/chatbotWindow';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.linkImageWrapper}>
                <Link href="/admin" className={styles.adminButton}>
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>
                </Link>
                <Image src="/images/chatbot_icon_1.png" alt="Chatbot" width={100} height={100} priority />
            </div>
            <h1>チャットボット!</h1>
            <ChatWindow />
        </main>
    );
}
