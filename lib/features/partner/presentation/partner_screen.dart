import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class PartnerScreen extends ConsumerStatefulWidget {
  const PartnerScreen({super.key});

  @override
  ConsumerState<PartnerScreen> createState() => _PartnerScreenState();
}

class _PartnerScreenState extends ConsumerState<PartnerScreen> {
  Map<String, dynamic> _partnerData = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPartnerData();
  }

  Future<void> _loadPartnerData() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;
    final doc = await FirebaseFirestore.instance.collection('partners').doc(user.uid).get();
    if (mounted) {
      setState(() {
        _partnerData = doc.data() ?? {};
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      appBar: AppBar(
        backgroundColor: AppColors.paper,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.ink, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text('Partner', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : _partnerData.isEmpty
              ? _applyView()
              : _dashboardView(),
    );
  }

  Widget _applyView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.handshake, size: 64, color: AppColors.primary),
            const SizedBox(height: AppSpacing.lg),
            Text(
              'Become an Enso Partner',
              style: AppTypography.heading1.copyWith(color: AppColors.ink),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Share Enso with others and earn commissions on premium subscriptions.',
              style: AppTypography.body.copyWith(color: AppColors.inkSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xl),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => context.push('/partners/apply'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                  padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                ),
                child: Text('Apply Now', style: AppTypography.body.copyWith(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _dashboardView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: _partnerData['status'] == 'approved' ? AppColors.success.withOpacity(0.1) : AppColors.warning.withOpacity(0.1),
              borderRadius: AppRadius.cardRadius,
              border: Border.all(color: _partnerData['status'] == 'approved' ? AppColors.success : AppColors.warning),
            ),
            child: Row(
              children: [
                Icon(
                  _partnerData['status'] == 'approved' ? Icons.check_circle : Icons.pending,
                  color: _partnerData['status'] == 'approved' ? AppColors.success : AppColors.warning,
                ),
                const SizedBox(width: AppSpacing.sm),
                Text(
                  'Status: ${_partnerData['status'] ?? 'pending'}',
                  style: AppTypography.body.copyWith(color: AppColors.ink),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // Stats
          Row(
            children: [
              Expanded(child: _statCard('${_partnerData['totalReferrals'] ?? 0}', 'Referrals', AppColors.primary)),
              const SizedBox(width: AppSpacing.md),
              Expanded(child: _statCard('${_partnerData['paidReferrals'] ?? 0}', 'Paid', AppColors.success)),
              const SizedBox(width: AppSpacing.md),
              Expanded(child: _statCard('₹${_partnerData['pendingPayout'] ?? 0}', 'Pending', AppColors.warning)),
            ],
          ),

          const SizedBox(height: AppSpacing.xl),

          // Referral code
          Text('Your Referral Code', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
          const SizedBox(height: AppSpacing.md),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.paperLight,
              borderRadius: AppRadius.cardRadius,
              border: Border.all(color: AppColors.enso),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _partnerData['referralCode'] ?? 'N/A',
                  style: AppTypography.heading2.copyWith(color: AppColors.ink, letterSpacing: 2),
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.copy, color: AppColors.primary),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // Quick links
          _quickLink('Invite Friends', Icons.person_add_outlined, () => context.push('/partner/invite')),
          _quickLink('Earnings', Icons.account_balance_wallet_outlined, () => context.push('/partner/earnings')),
          _quickLink('Academy', Icons.school_outlined, () => context.push('/partner/academy')),
          _quickLink('Partner Settings', Icons.settings_outlined, () => context.push('/partner/settings')),

          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _statCard(String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.paperLight,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.ensoLight),
      ),
      child: Column(
        children: [
          Text(value, style: AppTypography.heading2.copyWith(color: color)),
          const SizedBox(height: AppSpacing.xs),
          Text(label, style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
        ],
      ),
    );
  }

  Widget _quickLink(String label, IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.ensoLight)),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.inkSecondary, size: 20),
            const SizedBox(width: AppSpacing.md),
            Expanded(child: Text(label, style: AppTypography.body.copyWith(color: AppColors.ink))),
            const Icon(Icons.chevron_right, color: AppColors.inkSecondary, size: 20),
          ],
        ),
      ),
    );
  }
}
