import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class JournalScreen extends ConsumerStatefulWidget {
  const JournalScreen({super.key});

  @override
  ConsumerState<JournalScreen> createState() => _JournalScreenState();
}

class _JournalScreenState extends ConsumerState<JournalScreen> {
  final _controller = TextEditingController();
  bool _isPremium = false;
  bool _isRecording = false;
  bool _isUploading = false;
  Duration _recordDuration = Duration.zero;
  Timer? _recordTimer;
  final _audioRecorder = AudioRecorder();

  @override
  void initState() {
    super.initState();
    _checkPremium();
  }

  Future<void> _checkPremium() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;
    final doc = await FirebaseFirestore.instance.collection('users').doc(user.uid).get();
    if (mounted) {
      setState(() {
        _isPremium = doc.data()?['subscription'] == 'premium' || doc.data()?['subscription'] == 'active';
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _recordTimer?.cancel();
    _audioRecorder.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      backgroundColor: AppColors.paper,
      appBar: AppBar(
        backgroundColor: AppColors.paper,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.ink, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text('Journal', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _getDate(),
                    style: AppTypography.caption.copyWith(color: AppColors.inkSecondary),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'What\'s on your mind?',
                    style: AppTypography.heading2.copyWith(
                      color: AppColors.ink,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      maxLines: null,
                      expands: true,
                      textAlignVertical: TextAlignVertical.top,
                      style: AppTypography.body.copyWith(color: AppColors.ink, height: 1.6),
                      decoration: InputDecoration(
                        hintText: 'Begin writing...\n\nThis is your space. Write freely.',
                        hintStyle: AppTypography.body.copyWith(color: AppColors.enso),
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        filled: false,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Voice journaling area
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
            child: Row(
              children: [
                if (_isPremium)
                  Expanded(
                    child: GestureDetector(
                      onLongPress: _isRecording ? null : _startRecording,
                      onLongPressEnd: _isRecording ? (_) => _stopRecording() : null,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: _isRecording
                              ? AppColors.danger.withValues(alpha: 0.1)
                              : AppColors.paperLight,
                          borderRadius: AppRadius.buttonRadius,
                          border: Border.all(
                            color: _isRecording ? AppColors.danger : AppColors.ensoLight,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              _isRecording ? Icons.stop : Icons.mic,
                              color: _isRecording ? AppColors.danger : AppColors.primary,
                              size: 20,
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Expanded(
                              child: Text(
                                _isRecording
                                    ? _formatDuration(_recordDuration)
                                    : _isUploading
                                        ? 'Uploading...'
                                        : 'Hold to record',
                                style: AppTypography.bodySmall.copyWith(
                                  color: _isRecording ? AppColors.danger : AppColors.inkSecondary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                else
                  Expanded(
                    child: GestureDetector(
                      onTap: () => context.push('/subscription'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [AppColors.primary.withValues(alpha: 0.1), AppColors.primary.withValues(alpha: 0.05)],
                          ),
                          borderRadius: AppRadius.buttonRadius,
                          border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.mic, color: AppColors.primary, size: 20),
                            const SizedBox(width: AppSpacing.sm),
                            Expanded(
                              child: Text(
                                'Voice Journal',
                                style: AppTypography.bodySmall.copyWith(color: AppColors.primary),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text('PRO', style: AppTypography.caption.copyWith(color: Colors.white, fontSize: 10)),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                const SizedBox(width: AppSpacing.md),
                IconButton(
                  onPressed: _isUploading ? null : _saveEntry,
                  icon: Icon(
                    Icons.send,
                    color: _isUploading ? AppColors.enso : AppColors.primary,
                  ),
                ),
              ],
            ),
          ),

          // Previous entries
          StreamBuilder<QuerySnapshot>(
            stream: FirebaseFirestore.instance
                .collection('journalEntries')
                .where('uid', isEqualTo: user?.uid)
                .orderBy('createdAt', descending: true)
                .limit(10)
                .snapshots(),
            builder: (context, snapshot) {
              if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                return const SizedBox.shrink();
              }
              return Container(
                height: 120,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: snapshot.data!.docs.length,
                  itemBuilder: (context, index) {
                    final entry = snapshot.data!.docs[index].data() as Map<String, dynamic>;
                    final content = entry['content'] ?? '';
                    final type = entry['type'] ?? 'text';
                    final createdAt = entry['createdAt'] as Timestamp?;
                    return Container(
                      width: 160,
                      margin: const EdgeInsets.only(right: AppSpacing.sm),
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: AppColors.paperLight,
                        borderRadius: AppRadius.cardRadius,
                        border: Border.all(color: AppColors.ensoLight),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                type == 'voice' ? Icons.mic : Icons.edit,
                                size: 12,
                                color: AppColors.inkSecondary,
                              ),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  createdAt != null ? _formatDate(createdAt.toDate()) : '',
                                  style: AppTypography.caption.copyWith(color: AppColors.inkSecondary),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Expanded(
                            child: Text(
                              content,
                              maxLines: 4,
                              overflow: TextOverflow.ellipsis,
                              style: AppTypography.bodySmall.copyWith(color: AppColors.ink),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              );
            },
          ),

          const SizedBox(height: AppSpacing.md),
        ],
      ),
    );
  }

  String _getDate() {
    final now = DateTime.now();
    final months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return '${months[now.month - 1]} ${now.day}, ${now.year}';
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}';
  }

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  Future<void> _startRecording() async {
    final status = await Permission.microphone.request();
    if (!status.isGranted) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Microphone permission is required for voice journaling')),
        );
      }
      return;
    }

    if (!await _audioRecorder.hasPermission()) return;

    final dir = await getTemporaryDirectory();
    final path = '${dir.path}/journal_${DateTime.now().millisecondsSinceEpoch}.m4a';

    await _audioRecorder.start(
      RecordConfig(
        encoder: AudioEncoder.aacLc,
        bitRate: 128000,
        sampleRate: 44100,
      ),
      path: path,
    );

    setState(() {
      _isRecording = true;
      _recordDuration = Duration.zero;
    });

    _recordTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _recordDuration += const Duration(seconds: 1);
        });
      }
    });
  }

  Future<void> _stopRecording() async {
    _recordTimer?.cancel();
    final path = await _audioRecorder.stop();

    setState(() {
      _isRecording = false;
    });

    if (path != null && mounted) {
      setState(() => _isUploading = true);
      final file = File(path);
      try {
        final user = FirebaseAuth.instance.currentUser;
        if (user == null) return;

        final fileName = 'voice_journals/${user.uid}/${DateTime.now().millisecondsSinceEpoch}.m4a';
        final ref = FirebaseStorage.instance.ref().child(fileName);
        await ref.putFile(file);
        // Store the private object path, not a bearer download URL.
        final audioPath = fileName;

        await FirebaseFirestore.instance.collection('journalEntries').add({
          'uid': user.uid,
          'content': _controller.text.trim().isNotEmpty ? _controller.text.trim() : 'Voice journal entry',
          'audioPath': audioPath,
          'durationSeconds': _recordDuration.inSeconds,
          'type': 'voice',
          'createdAt': FieldValue.serverTimestamp(),
        });

        _controller.clear();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Voice entry saved')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Upload failed: $e')),
          );
        }
      } finally {
        if (mounted) setState(() => _isUploading = false);
        await file.delete();
      }
    }
  }

  Future<void> _saveEntry() async {
    if (_controller.text.trim().isEmpty) return;
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    await FirebaseFirestore.instance.collection('journalEntries').add({
      'uid': user.uid,
      'content': _controller.text.trim(),
      'createdAt': FieldValue.serverTimestamp(),
      'type': 'text',
    });

    _controller.clear();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Entry saved')),
      );
    }
  }
}
