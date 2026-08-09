import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
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
  Timer? _timer;

  final _durations = [3, 5, 10, 15, 20, 30];

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final totalSeconds = _selectedMinutes * 60;
    final remaining = totalSeconds - _elapsedSeconds;
    final progress = _isTimerRunning ? _elapsedSeconds / totalSeconds : 0.0;

    return Scaffold(
      backgroundColor: AppColors.paper,
      appBar: AppBar(
        backgroundColor: AppColors.paper,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.ink, size: 20),
          onPressed: () {
            _timer?.cancel();
            context.pop();
          },
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
              GestureDetector(
                onTap: _toggleTimer,
                child: SizedBox(
                  width: 220,
                  height: 220,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        width: 220,
                        height: 220,
                        child: CircularProgressIndicator(
                          value: _isTimerRunning ? progress : 0.0,
                          strokeWidth: 3,
                          backgroundColor: AppColors.enso.withValues(alpha: 0.2),
                          valueColor: AlwaysStoppedAnimation<Color>(
                            _isTimerRunning ? AppColors.primary : AppColors.enso,
                          ),
                          strokeCap: StrokeCap.round,
                        ),
                      ),
                      Container(
                        width: 180,
                        height: 180,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _isTimerRunning
                              ? AppColors.primary.withValues(alpha: 0.05)
                              : AppColors.paperLight,
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
                                  _formatTime(remaining),
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
                    ],
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.xl),

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

              Text(
                _isTimerRunning
                    ? 'Breathe in slowly... hold... breathe out gently.'
                    : 'Find a comfortable position.\nClose your eyes or soften your gaze.',
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
    setState(() {
      _isTimerRunning = true;
      _elapsedSeconds = 0;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() {
        _elapsedSeconds++;
      });
      if (_elapsedSeconds >= _selectedMinutes * 60) {
        _completeTimer();
      }
    });
  }

  void _stopTimer() {
    _timer?.cancel();
    setState(() {
      _isTimerRunning = false;
    });
    _saveSession(completed: false);
  }

  void _completeTimer() {
    _timer?.cancel();
    setState(() {
      _isTimerRunning = false;
    });
    _saveSession(completed: true);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Session complete. $_selectedMinutes minutes of stillness.'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  Future<void> _saveSession({required bool completed}) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null || _elapsedSeconds < 10) return;

    await FirebaseFirestore.instance.collection('meditationSessions').add({
      'uid': user.uid,
      'durationSeconds': _elapsedSeconds,
      'plannedMinutes': _selectedMinutes,
      'completed': completed,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }
}
