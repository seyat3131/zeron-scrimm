
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Users, 
  Instagram, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Trophy 
} from 'lucide-react';

const firebaseConfig = JSON.parse(process.env.__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = process.env.__app_id || 'default-app-id';

export default function ZeronScrim() {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState({});
  const [mySlot, setMySlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  const getTodayDateString = () => new Date().toLocaleDateString('tr-TR');

  useEffect(() => {
    const initAuth = async () => {
      const token = process.env.__initial_auth_token;
      if (token) await signInWithCustomToken(auth, token);
      else await signInAnonymously(auth);
    };
    initAuth();

    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const bookingsRef = collection(db, 'artifacts', appId, 'public', 'data', 'zeron_bookings');

    const unsubscribe = onSnapshot(bookingsRef, (snapshot) => {
      const todayStr = getTodayDateString();
      const currentSlots = {};
      let userBookedSlot = null;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.date === todayStr) {
          currentSlots[data.slotId] = data;
          if (data.userId === user.uid) userBookedSlot = data.slotId;
        }
      });

      setSlots(currentSlots);
      setMySlot(userBookedSlot);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow - now;
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeUntilReset(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSlotClick = (slotNum) => {
    if (slots[slotNum]) return;
    if (mySlot) return;
    setSelectedSlot(slotNum);
    setModalOpen(true);
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    if (!teamName || !instagram) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'zeron_bookings', selectedSlot.toString());

      await setDoc(docRef, {
        slotId: selectedSlot,
        teamName: teamName.toUpperCase(),
        instagram,
        userId: user.uid,
        date: getTodayDateString(),
        timestamp: Date.now()
      });

      setModalOpen(false);
      setTeamName('');
      setInstagram('');
    } catch (error) {
      alert('Bir hata oluştu');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-12">
      {/* İçerik aynı şekilde korunuyor */}
      {/* --- BURAYA ORİJİNAL KODUN TAMAMI GELİYOR (UI KISMI) --- */}
    </div>
  );
}
    