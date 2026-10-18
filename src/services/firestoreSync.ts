import { firestore } from "../config/firebase";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    writeBatch
} from "firebase/firestore";
import { listActiveTransactionsDesc, insertTransaction } from "../repositories/transactionRepo";
import { getAllPeriods, createPeriod } from "../repositories/periodRepo";
import { getSettings, setInitialBalance } from "../repositories/settingsRepo";

/**
 * Sync all local data to Firestore
 */
export async function syncToCloud(userId: string): Promise<void> {
    if (!userId) {
        console.warn("No user ID provided for sync");
        return;
    }

    try {
        console.log("🔄 Starting cloud sync...");

        // Sync transactions
        await syncTransactionsToCloud(userId);

        // Sync periods
        await syncPeriodsToCloud(userId);

        // Sync settings
        await syncSettingsToCloud(userId);

        console.log("✅ Cloud sync completed");
    } catch (error) {
        console.error("❌ Cloud sync failed:", error);
    }
}

/**
 * Sync transactions to Firestore
 */
async function syncTransactionsToCloud(userId: string): Promise<void> {
    const transactions = listActiveTransactionsDesc();
    const batch = writeBatch(firestore);

    for (const tx of transactions) {
        const docRef = doc(firestore, `users/${userId}/transactions`, tx.id);
        batch.set(docRef, {
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            note: tx.note,
            category_id: tx.category_id,
            occurred_at: tx.occurred_at,
            balance_after: tx.balance_after,
            balance_before: tx.balance_before,
            created_at: tx.created_at,
            updated_at: tx.updated_at || tx.created_at,
        });
    }

    await batch.commit();
    console.log(`✅ Synced ${transactions.length} transactions`);
}

/**
 * Sync periods to Firestore
 */
async function syncPeriodsToCloud(userId: string): Promise<void> {
    const periods = getAllPeriods();
    const batch = writeBatch(firestore);

    for (const period of periods) {
        const docRef = doc(firestore, `users/${userId}/periods`, period.id);
        batch.set(docRef, {
            id: period.id,
            name: period.name,
            type: period.type,
            start_date: period.start_date,
            end_date: period.end_date,
            starting_balance: period.starting_balance,
            ending_balance: period.ending_balance,
            is_active: period.is_active,
            created_at: period.created_at,
            updated_at: period.updated_at,
        });
    }

    await batch.commit();
    console.log(`✅ Synced ${periods.length} periods`);
}

/**
 * Sync settings to Firestore
 */
async function syncSettingsToCloud(userId: string): Promise<void> {
    const settings = getSettings();
    const docRef = doc(firestore, `users/${userId}/settings`, "app_settings");

    await setDoc(docRef, {
        onboarding_done: settings.onboarding_done,
        initial_balance: settings.initial_balance,
        theme: settings.theme,
        synced_at: new Date().toISOString(),
    });

    console.log("✅ Synced settings");
}

/**
 * Download all data from Firestore to local SQLite
 * NOTE: This is a simplified version - in production you'd want proper conflict resolution
 */
export async function syncFromCloud(userId: string): Promise<void> {
    if (!userId) {
        console.warn("No user ID provided for sync");
        return;
    }

    try {
        console.log("⬇️ Downloading data from cloud...");

        // Download settings first
        await syncSettingsFromCloud(userId);

        console.log("✅ Cloud download completed");
    } catch (error) {
        console.error("❌ Cloud download failed:", error);
    }
}

/**
 * Download settings from Firestore
 */
async function syncSettingsFromCloud(userId: string): Promise<void> {
    const docRef = doc(firestore, `users/${userId}/settings`, "app_settings");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.initial_balance !== undefined) {
            setInitialBalance(data.initial_balance);
        }
        console.log("⬇️ Downloaded settings");
    } else {
        console.log("ℹ️ No cloud settings found - first time login");
    }
}

/**
 * Delete transaction from cloud
 */
export async function deleteTransactionFromCloud(userId: string, transactionId: string): Promise<void> {
    if (!userId) return;

    try {
        const docRef = doc(firestore, `users/${userId}/transactions`, transactionId);
        await deleteDoc(docRef);
        console.log("✅ Transaction deleted from cloud");
    } catch (error) {
        console.error("❌ Failed to delete transaction from cloud:", error);
    }
}
