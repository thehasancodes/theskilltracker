import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { fetchDashboard } from './src/data/dashboardData';

const colors = {
  background: '#0a0a0a',
  surface: '#181918',
  chrome: '#343438',
  line: '#505154',
  text: '#e2e8f0',
  muted: '#cbd5e1',
  faint: '#a8b1bd',
  purple: '#a7addf',
  purpleBg: '#292b4c',
  teal: '#63e6e2',
  tealBg: '#15474d',
  success: '#9bd1c0',
};

function MenuIcon() {
  return <View style={styles.menuIcon}>{[0, 1, 2].map((item) => <View key={item} style={styles.menuLine} />)}</View>;
}

function PowerIcon() {
  return <View style={styles.powerIcon}><View style={styles.powerArc} /><View style={styles.powerStem} /></View>;
}

function ProfileIcon() {
  return <View style={styles.profileIcon}><View style={styles.profileHead} /><View style={styles.profileBody} /></View>;
}

function Tag({ children, tone = 'purple' }) {
  return <View style={[styles.tag, tone === 'teal' && styles.tealTag]}><Text style={[styles.tagText, tone === 'teal' && styles.tealTagText]}>{children}</Text></View>;
}

function TrackCard({ track, onPress }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${track.title}`} onPress={onPress} style={({ pressed }) => [styles.trackCard, pressed && styles.pressed]}>
      <View style={styles.trackTop}>
        <Tag tone={track.tone}>{track.label}</Tag>
        <Text style={styles.arrow}>→</Text>
      </View>
      <Text style={styles.trackTitle}>{track.title}</Text>
      <Text style={styles.trackDescription}>{track.description}</Text>
      <View style={styles.rule} />
      <Text style={styles.progress}><Text style={styles.progressLabel}>Solved: </Text><Text style={styles.progressValue}>{track.solved}</Text><Text style={styles.progressTotal}> / {track.total}</Text></Text>
    </Pressable>
  );
}

function LoadingState() {
  return <View style={styles.state}><ActivityIndicator color={colors.teal} size="large" /><Text style={styles.stateText}>Loading your dashboard...</Text></View>;
}

function ErrorState({ onRetry }) {
  return <View style={styles.state}><Text style={styles.stateTitle}>Unable to load dashboard</Text><Text style={styles.stateText}>Please check your connection and try again.</Text><Pressable onPress={onRetry} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable></View>;
}

function EmptyState() {
  return <View style={styles.state}><Text style={styles.stateTitle}>No tracks yet</Text><Text style={styles.stateText}>Your learning tracks will appear here.</Text></View>;
}

function Dashboard({ dashboard, onMenu, onLogout, onTrackPress }) {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 40, 560);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.appBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Open navigation" onPress={onMenu} style={styles.menuButton}><MenuIcon /></Pressable>
        <Text style={styles.brand}>SkillTracker</Text>
        <View style={styles.accountActions}>
          <ProfileIcon />
          <Pressable accessibilityRole="button" accessibilityLabel="Log out" onPress={onLogout} style={styles.logoutButton}><PowerIcon /><Text style={styles.logoutText}>Logout</Text></Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth: contentWidth }]} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.pageTitle}>Student Command Centre</Text>
          <Text style={styles.welcome}>Welcome <Text style={styles.welcomeName}>{dashboard.user.name}</Text></Text>
        </View>
        <View style={styles.heroCard}>
          <Tag>STUDENT ACADEMIC DASHBOARD</Tag>
          <Text style={styles.heroTitle}>MY STUDENT{'\n'}DASHBOARD</Text>
          <Text style={styles.heroSubtitle}>B.Tech  •  Semester 5 Coursework &amp; Practice{'\n'}Track Progress</Text>
        </View>
        {dashboard.tracks.length ? dashboard.tracks.map((track) => <TrackCard key={track.id} track={track} onPress={() => onTrackPress(track)} />) : <EmptyState />}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerAvatar}><Text style={styles.avatarText}>{dashboard.user.name[0]}</Text></View>
        <View><Text style={styles.footerName}>{dashboard.user.name}</Text><Text style={styles.footerRole}>{dashboard.user.role}</Text></View>
        <Pressable onPress={onLogout} style={styles.footerLogout}><Text style={styles.footerLogoutText}>Logout</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Jakarta: PlusJakartaSans_400Regular, JakartaMedium: PlusJakartaSans_500Medium, JakartaSemiBold: PlusJakartaSans_600SemiBold, JakartaBold: PlusJakartaSans_700Bold, JakartaExtraBold: PlusJakartaSans_800ExtraBold });
  const [status, setStatus] = useState('loading');
  const [dashboard, setDashboard] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);

  const loadDashboard = () => {
    setStatus('loading');
    fetchDashboard().then((data) => { setDashboard(data); setStatus('success'); }).catch(() => setStatus('error'));
  };
  useEffect(() => { loadDashboard(); }, []);

  if (!fontsLoaded || status === 'loading') return <View style={styles.loadingScreen}><LoadingState /></View>;
  if (status === 'error') return <View style={styles.loadingScreen}><ErrorState onRetry={loadDashboard} /></View>;
  if (loggedOut) return <View style={styles.loadingScreen}><Text style={styles.stateTitle}>You&apos;re logged out</Text><Text style={styles.stateText}>Sign in again to continue tracking your progress.</Text><Pressable onPress={() => setLoggedOut(false)} style={styles.retryButton}><Text style={styles.retryText}>Return to dashboard</Text></Pressable></View>;

  return (
    <>
      <Dashboard dashboard={dashboard} onMenu={() => setMenuOpen(true)} onLogout={() => setLoggedOut(true)} onTrackPress={setSelectedTrack} />
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={styles.drawer}><Text style={styles.drawerTitle}>Navigation</Text><Text style={styles.drawerItem}>Dashboard</Text><Text style={styles.drawerItem}>My progress</Text><Text style={styles.drawerItem}>Coursework</Text></View>
        </Pressable>
      </Modal>
      <Modal visible={Boolean(selectedTrack)} transparent animationType="slide" onRequestClose={() => setSelectedTrack(null)}>
        <View style={styles.detailBackdrop}><View style={styles.detailCard}><Tag tone={selectedTrack?.tone}>{selectedTrack?.label}</Tag><Text style={styles.detailTitle}>{selectedTrack?.title}</Text><Text style={styles.detailText}>{selectedTrack?.description}</Text><Pressable style={styles.retryButton} onPress={() => setSelectedTrack(null)}><Text style={styles.retryText}>Close</Text></Pressable></View></View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.chrome },
  appBar: { height: 94, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: 'row', alignItems: 'center' },
  menuButton: { width: 70, height: 68, borderWidth: 5, borderColor: '#e33c3c', alignItems: 'center', justifyContent: 'center' },
  menuIcon: { gap: 7 },
  menuLine: { width: 31, height: 3, borderRadius: 2, backgroundColor: colors.text },
  brand: { marginLeft: 12, color: '#f8fafc', fontFamily: 'JakartaBold', fontSize: 28, letterSpacing: -1 },
  accountActions: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 14 },
  profileIcon: { width: 52, height: 52, borderRadius: 28, backgroundColor: '#5c6370', borderWidth: 1, borderColor: '#7d8490', alignItems: 'center', justifyContent: 'center' },
  profileHead: { width: 18, height: 18, borderRadius: 10, backgroundColor: '#cbd5e1', marginBottom: 2 },
  profileBody: { width: 32, height: 16, borderRadius: 18, backgroundColor: '#aeb8c4' },
  powerIcon: { width: 25, height: 25, alignItems: 'center' },
  powerArc: { position: 'absolute', top: 2, width: 21, height: 21, borderRadius: 12, borderWidth: 2, borderTopColor: 'transparent', borderLeftColor: colors.text, borderRightColor: colors.text, borderBottomColor: colors.text },
  powerStem: { width: 2, height: 12, backgroundColor: colors.text },
  logoutButton: { alignItems: 'center', gap: 2 },
  logoutText: { color: colors.muted, fontFamily: 'Jakarta', fontSize: 14 },
  scrollContent: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 28, backgroundColor: colors.chrome },
  intro: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  pageTitle: { color: colors.text, fontFamily: 'JakartaBold', fontSize: 27, letterSpacing: -0.5 },
  welcome: { color: colors.text, fontFamily: 'Jakarta', fontSize: 18, marginTop: 3 },
  welcomeName: { fontFamily: 'JakartaMedium', marginLeft: 3 },
  heroCard: { marginTop: 20, minHeight: 264, borderRadius: 24, borderWidth: 1, borderColor: '#5b5c5c', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 18 },
  tag: { borderRadius: 20, borderWidth: 1, borderColor: '#666ba3', backgroundColor: colors.purpleBg, paddingHorizontal: 15, paddingVertical: 7 },
  tagText: { color: colors.purple, fontFamily: 'JakartaMedium', fontSize: 15, letterSpacing: 0.5 },
  tealTag: { borderColor: '#258b96', backgroundColor: colors.tealBg },
  tealTagText: { color: colors.teal },
  heroTitle: { marginTop: 14, textAlign: 'center', color: '#f1f5f9', fontFamily: 'JakartaSemiBold', fontSize: 43, lineHeight: 48, letterSpacing: -1 },
  heroSubtitle: { marginTop: 12, textAlign: 'center', color: colors.muted, fontFamily: 'Jakarta', fontSize: 17, lineHeight: 25 },
  trackCard: { marginTop: 20, minHeight: 258, borderRadius: 24, borderWidth: 1, borderColor: '#5b5c5c', backgroundColor: colors.surface, padding: 30, justifyContent: 'center' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  trackTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { color: '#aeb9c6', fontSize: 35, fontFamily: 'Jakarta', marginTop: -5 },
  trackTitle: { color: '#f1f5f9', fontFamily: 'JakartaSemiBold', fontSize: 26, marginTop: 14 },
  trackDescription: { color: colors.muted, fontFamily: 'Jakarta', fontSize: 17, lineHeight: 25, marginTop: 8 },
  rule: { height: 1, backgroundColor: '#575959', marginVertical: 14 },
  progress: { fontFamily: 'Jakarta', fontSize: 16 },
  progressLabel: { color: colors.success },
  progressValue: { color: colors.purple, fontFamily: 'JakartaSemiBold' },
  progressTotal: { color: colors.success },
  footer: { minHeight: 104, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.chrome, flexDirection: 'row', alignItems: 'center', gap: 14 },
  footerAvatar: { width: 60, height: 60, borderRadius: 32, backgroundColor: '#35e3e0', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#172b35', fontFamily: 'Jakarta', fontSize: 28 },
  footerName: { color: '#f8fafc', fontFamily: 'JakartaBold', fontSize: 20 },
  footerRole: { color: colors.muted, fontFamily: 'Jakarta', fontSize: 18 },
  footerLogout: { marginLeft: 'auto' },
  footerLogoutText: { color: colors.muted, fontFamily: 'Jakarta', fontSize: 19 },
  loadingScreen: { flex: 1, backgroundColor: colors.chrome, alignItems: 'center', justifyContent: 'center', padding: 24 },
  state: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateTitle: { color: colors.text, fontFamily: 'JakartaBold', fontSize: 22, textAlign: 'center' },
  stateText: { color: colors.muted, fontFamily: 'Jakarta', fontSize: 16, textAlign: 'center' },
  retryButton: { marginTop: 8, borderRadius: 12, backgroundColor: colors.teal, paddingHorizontal: 20, paddingVertical: 12 },
  retryText: { color: '#092329', fontFamily: 'JakartaBold', fontSize: 15 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  drawer: { width: 270, height: '100%', padding: 30, paddingTop: 70, backgroundColor: '#202125' },
  drawerTitle: { color: colors.text, fontFamily: 'JakartaBold', fontSize: 22, marginBottom: 28 },
  drawerItem: { color: colors.muted, fontFamily: 'JakartaMedium', fontSize: 17, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  detailBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' },
  detailCard: { backgroundColor: '#242528', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 28, paddingBottom: 42, gap: 14 },
  detailTitle: { color: colors.text, fontFamily: 'JakartaBold', fontSize: 28 },
  detailText: { color: colors.muted, fontFamily: 'Jakarta', fontSize: 17, lineHeight: 26 },
});
