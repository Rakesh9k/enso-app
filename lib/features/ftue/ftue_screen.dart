import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class FtueScreen extends ConsumerStatefulWidget {
  const FtueScreen({super.key});

  @override
  ConsumerState<FtueScreen> createState() => _FtueScreenState();
}

class _FtueScreenState extends ConsumerState<FtueScreen> {
  final _controller = PageController();
  int _currentPage = 0;

  final _pages = [
    _FtuePage(
      icon: Icons.self_improvement,
      title: 'Welcome to Enso',
      subtitle: 'A sanctuary for your inner life.\nNo noise. Just you and your practice.',
    ),
    _FtuePage(
      icon: Icons.edit_note,
      title: 'Reflect & Write',
      subtitle: 'Journal your thoughts, moods, and reflections.\nYour words, your space.',
    ),
    _FtuePage(
      icon: Icons.insights,
      title: 'Understand Yourself',
      subtitle: 'AI-powered insights help you see patterns\nyou might otherwise miss.',
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: () => context.go('/login'),
                child: Text('Skip', style: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary)),
              ),
            ),

            // Pages
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _pages.length,
                onPageChanged: (i) => setState(() => _currentPage = i),
                itemBuilder: (context, i) => _pages[i],
              ),
            ),

            // Dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_pages.length, (i) {
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _currentPage == i ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentPage == i ? AppColors.primary : AppColors.enso,
                    borderRadius: AppRadius.pillRadius,
                  ),
                );
              }),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Next / Get Started button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    if (_currentPage < _pages.length - 1) {
                      _controller.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
                    } else {
                      context.go('/login');
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.ink,
                    foregroundColor: AppColors.paper,
                    shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                  ),
                  child: Text(
                    _currentPage < _pages.length - 1 ? 'Next' : 'Get Started',
                    style: AppTypography.body.copyWith(color: AppColors.paper),
                  ),
                ),
              ),
            ),

            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }
}

class _FtuePage extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _FtuePage({required this.icon, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.xl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.enso, width: 2),
            ),
            child: Center(child: Icon(icon, size: 48, color: AppColors.primary)),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(title, style: AppTypography.heading1.copyWith(color: AppColors.ink), textAlign: TextAlign.center),
          const SizedBox(height: AppSpacing.md),
          Text(subtitle, style: AppTypography.body.copyWith(color: AppColors.inkSecondary, height: 1.6), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
