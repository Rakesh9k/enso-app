import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class MeditationScreen extends ConsumerStatefulWidget {
  const MeditationScreen({super.key});

  @override
  ConsumerState<MeditationScreen> createState() => _MeditationScreenState();
}

class _MeditationScreenState extends ConsumerState<MeditationScreen> {
  bool _isTimerRunning = false;
  int _selectedMinutes = 5;
  int _elapsedSeconds = 0;

  final _durations = [3, 5, 10, 15, 20, 30];

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
        title: Text('Stillness', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Timer circle
              GestureDetector(
                onTap: _toggleTimer,
                child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _isTimerRunning ? AppColors.primary.withOpacity(0.1) : AppColors.paperLight,
                    border: Border.all(
                      color: _isTimerRunning ? AppColors.primary : AppColors.enso,
                      width: 2,
                    ),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (_isTimerRunning) ...[
                          Text(
                            _formatTime(_selectedMinutes * 60 - _elapsedSeconds),
                            style: AppTypography.heading1.copyWith(
                              color: AppColors.ink,
                              fontSize: 36,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Text(
                            'breathing',
                            style: AppTypography.caption.copyWith(color: AppColors.inkSecondary),
                          ),
                        ] else ...[
                          const Icon(Icons.play_arrow, color: AppColors.ink, size: 48),
                          const SizedBox(height: AppSpacing.xs),
                          Text(
                            '$_selectedMinutes min',
                            style: AppTypography.body.copyWith(color: AppColors.inkSecondary),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.xl),

              // Duration selector
              if (!_isTimerRunning)
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  alignment: WrapAlignment.center,
                  children: _durations.map((min) {
                    final selected = _selectedMinutes == min;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedMinutes = min),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: selected ? AppColors.ink : AppColors.paperLight,
                          borderRadius: AppRadius.pillRadius,
                          border: Border.all(color: selected ? AppColors.ink : AppColors.enso),
                        ),
                        child: Text(
                          '$min min',
                          style: AppTypography.bodySmall.copyWith(
                            color: selected ? AppColors.paper : AppColors.ink,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

              const SizedBox(height: AppSpacing.xl),

              // Controls
              if (_isTimerRunning)
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      onPressed: _stopTimer,
                      icon: const Icon(Icons.stop_circle, color: AppColors.danger, size: 48),
                    ),
                  ],
                ),

              const SizedBox(height: AppSpacing.xl),

              // Session info
              Text(
                'Find a comfortable position.\nClose your eyes or soften your gaze.',
                textAlign: TextAlign.center,
                style: AppTypography.body.copyWith(
                  color: AppColors.inkSecondary,
                  fontStyle: FontStyle.italic,
                  height: 1.6,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTime(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  void _toggleTimer() {
    if (_isTimerRunning) {
      _stopTimer();
    } else {
      _startTimer();
    }
  }

  void _startTimer() {
    setState(() { _isTimerRunning = true; _elapsedSeconds = 0; });
    // In production, this would use a proper timer
  }

  void _stopTimer() {
    setState(() { _isTimerRunning = false; });
    // Save session to Firestore
    _saveSession();
  }

  Future<void> _saveSession() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null || _elapsedSeconds < 10) return;

    await FirebaseFirestore.instance.collection('meditationSessions').add({
      'uid': user.uid,
      'durationSeconds': _elapsedSeconds,
      'plannedMinutes': _selectedMinutes,
      'completedAt': FieldValue.serverTimestamp(),
    });
  }
}
