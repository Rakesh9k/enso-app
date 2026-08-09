import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      appBar: AppBar(
        backgroundColor: AppColors.paper,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.ink, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text('Settings', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _section('Account', [
              _tile('Edit Profile', Icons.person_outline, () {}),
              _tile('Email & Password', Icons.email_outlined, () {}),
              _tile('Connected Accounts', Icons.link, () {}),
            ]),

            const SizedBox(height: AppSpacing.lg),

            _section('Notifications', [
              _tile('Push Notifications', Icons.notifications_outlined, () {}),
              _tile('Email Notifications', Icons.mail_outline, () {}),
              _tile('Reminder Schedule', Icons.schedule, () {}),
            ]),

            const SizedBox(height: AppSpacing.lg),

            _section('Appearance', [
              _tile('Theme', Icons.palette_outlined, () {}),
              _tile('Font Size', Icons.text_fields, () {}),
            ]),

            const SizedBox(height: AppSpacing.lg),

            _section('Privacy & Security', [
              _tile('Privacy Policy', Icons.lock_outline, () {}),
              _tile('Terms of Service', Icons.description, () {}),
              _tile('Delete Account', Icons.delete_outline, () {}, isDanger: true),
            ]),

            const SizedBox(height: AppSpacing.lg),

            _section('Support', [
              _tile('Help Center', Icons.help_outline, () {}),
              _tile('Contact Us', Icons.mail_outline, () {}),
              _tile('Rate the App', Icons.star_outline, () {}),
              _tile('App Version', Icons.info_outline, () {}, trailing: Text('1.0.0', style: AppTypography.caption.copyWith(color: AppColors.inkSecondary))),
            ]),

            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _section(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: AppTypography.caption.copyWith(color: AppColors.inkSecondary, fontWeight: FontWeight.w600)),
        const SizedBox(height: AppSpacing.sm),
        Container(
          decoration: BoxDecoration(
            color: AppColors.paperLight,
            borderRadius: AppRadius.cardRadius,
            border: Border.all(color: AppColors.ensoLight),
          ),
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _tile(String label, IconData icon, VoidCallback onTap, {bool isDanger = false, Widget? trailing}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.md),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.ensoLight, width: 0.5)),
        ),
        child: Row(
          children: [
            Icon(icon, color: isDanger ? AppColors.danger : AppColors.inkSecondary, size: 20),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Text(
                label,
                style: AppTypography.body.copyWith(color: isDanger ? AppColors.danger : AppColors.ink),
              ),
            ),
            trailing ?? const Icon(Icons.chevron_right, color: AppColors.inkSecondary, size: 20),
          ],
        ),
      ),
    );
  }
}
