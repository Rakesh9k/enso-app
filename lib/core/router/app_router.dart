import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../features/auth/auth_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/journal/journal_screen.dart';
import '../../features/meditation/meditation_screen.dart';
import '../../features/insights/presentation/screens/insights_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/settings/settings_screen.dart';
import '../../features/subscription/subscription_screen.dart';
import '../../features/partner/presentation/partner_screen.dart';
import '../../features/ftue/ftue_screen.dart';
import '../../features/daily_session/presentation/daily_session_screen.dart';
import '../../features/journey/presentation/screens/journey_screen.dart';
import '../../features/reports/presentation/reports_screen.dart';
import '../../features/notifications/notifications_screen.dart';
import '../../features/app_update/app_update_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/dashboard',
    redirect: (context, state) {
      final user = FirebaseAuth.instance.currentUser;
      final isLoggedIn = user != null;
      final isLoginRoute = state.matchedLocation == '/login';
      final isFtueRoute = state.matchedLocation == '/ftue';

      if (!isLoggedIn && !isLoginRoute && !isFtueRoute) {
        return '/ftue';
      }
      if (isLoggedIn && (isLoginRoute || isFtueRoute)) {
        return '/dashboard';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/ftue', builder: (context, state) => const FtueScreen()),
      GoRoute(path: '/login', builder: (context, state) => const AuthScreen()),
      GoRoute(path: '/dashboard', builder: (context, state) => const HomeScreen()),
      GoRoute(path: '/journal', builder: (context, state) => const JournalScreen()),
      GoRoute(path: '/meditation', builder: (context, state) => const MeditationScreen()),
      GoRoute(path: '/insights', builder: (context, state) => const InsightsScreen()),
      GoRoute(path: '/profile', builder: (context, state) => const ProfileScreen()),
      GoRoute(path: '/settings', builder: (context, state) => const SettingsScreen()),
      GoRoute(path: '/subscription', builder: (context, state) => const SubscriptionScreen()),
      GoRoute(path: '/partner', builder: (context, state) => const PartnerScreen()),
      GoRoute(path: '/daily-session', builder: (context, state) => const DailySessionScreen()),
      GoRoute(path: '/journey', builder: (context, state) => const JourneyScreen()),
      GoRoute(path: '/reports', builder: (context, state) => const ReportsScreen()),
      GoRoute(path: '/notifications', builder: (context, state) => const NotificationsScreen()),
      GoRoute(path: '/app-update', builder: (context, state) => const AppUpdateScreen()),
    ],
  );
});
