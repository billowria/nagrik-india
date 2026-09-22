import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CheckCircle2, RefreshCw, TrafficCone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTraffic } from "@/lib/traffic-store";
import { Page, SectionTitle } from "@/features/shared/components/common";
import { DevConsole } from "@/features/shared/components/dev-console";
import { cn } from "@/lib/utils";

export function MarshalTrainingPage() {
  const s = useTraffic();
  const nav = useNavigate();
  const lessons = [
    "Safety before speed",
    "Make yourself visible in public spaces",
    "Address minor civic obstructions without creating risk",
    "De-escalate conflict; escalate violence to police",
    "Document and hand off clearly",
  ];
  const [lesson, setLesson] = useState(0);
  const [quiz, setQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  if (s.trainingComplete) {
    return (
      <Page title="Training complete" eyebrow="You’re mission-ready">
        <div className="rounded-3xl bg-safe-soft p-6 text-center">
          <BadgeCheck className="mx-auto h-14 w-14 text-safe" />
          <h2 className="mt-3 text-xl font-extrabold">Safety certified</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your dashboard is now unlocked.</p>
        </div>
        <Button
          className="mt-6 h-14 w-full rounded-2xl"
          onClick={() => nav({ to: "/marshal/dashboard" })}
        >
          Open marshal dashboard
        </Button>
        <DevConsole />
      </Page>
    );
  }

  if (lesson < 5) {
    return (
      <Page title={lessons[lesson] ?? "Safety lesson"} eyebrow={`Lesson ${lesson + 1} of 5`}>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(lesson + 1) * 20}%` }}
          />
        </div>
        <div className="rounded-3xl bg-orange-soft p-6">
          <TrafficCone className="h-12 w-12 text-primary" />
          <h2 className="mt-5 text-lg font-extrabold">
            A civic issue needs attention in a busy public area.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Pause, assess traffic, make yourself visible, and protect a safe working area before
            approaching.
          </p>
        </div>
        <SectionTitle>What good looks like</SectionTitle>
        <ul className="space-y-3">
          {[
            "Scan approaching traffic and escape routes",
            "Use reflective gear and safe hand signals",
            "Never trade your safety for a faster response",
          ].map((x) => (
            <li key={x} className="flex gap-3 text-sm">
              <CheckCircle2 className="shrink-0 text-safe" />
              {x}
            </li>
          ))}
        </ul>
        <Button className="mt-8 h-14 w-full rounded-2xl" onClick={() => setLesson(lesson + 1)}>
          {lesson === 4 ? "Start safety quiz" : "Next lesson"}
          <ArrowRight />
        </Button>
        <DevConsole />
      </Page>
    );
  }

  const qs = [
    "A driver is shouting and moving closer. What first?",
    "A box blocks a fast lane. What should you do?",
    "What must happen before leaving a resolved job?",
  ];
  const answers = [
    "Keep distance and call police if danger rises",
    "Assess traffic and only move it from a protected position",
    "Document the outcome and notify the requester",
  ];

  return (
    <Page
      title={
        quiz < 3
          ? (qs[quiz] ?? "Safety question")
          : score >= 2
            ? "You passed"
            : "Retake the full quiz"
      }
      eyebrow={quiz < 3 ? `Question ${quiz + 1} of 3` : "Quiz result"}
    >
      {quiz < 3 ? (
        <>
          <div className="mt-6 grid gap-3">
            {[
              answers[quiz] ?? "Choose the safest action",
              "Act immediately to save time",
              "Ask the requester to handle it",
            ].map((a, i) => (
              <button
                key={a}
                disabled={answered}
                onClick={() => {
                  setAnswered(true);
                  if (i === 0) setScore(score + 1);
                }}
                className={cn(
                  "rounded-2xl border bg-card p-4 text-left text-sm font-bold",
                  answered && (i === 0 ? "border-safe bg-safe-soft" : "opacity-50"),
                )}
              >
                {a}
              </button>
            ))}
          </div>
          {answered && (
            <div className="mt-5 rounded-2xl bg-safe-soft p-4 text-sm text-safe">
              <b>Correct approach:</b> safety and clear escalation always come first.
            </div>
          )}
          <Button
            disabled={!answered}
            className="mt-6 h-14 w-full rounded-2xl"
            onClick={() => {
              setQuiz(quiz + 1);
              setAnswered(false);
            }}
          >
            Continue
          </Button>
        </>
      ) : score >= 2 ? (
        <>
          <div className="rounded-3xl bg-safe-soft p-6 text-center">
            <BadgeCheck className="mx-auto h-14 w-14 text-safe" />
            <b className="mt-3 block text-xl">{score}/3 — Safety certified</b>
          </div>
          <Button className="mt-6 h-14 w-full rounded-2xl" onClick={s.completeTraining}>
            Unlock dashboard
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            You scored {score}/3. A score of 2 is required.
          </p>
          <Button
            className="mt-6 h-14 w-full rounded-2xl"
            onClick={() => {
              setQuiz(0);
              setScore(0);
            }}
          >
            <RefreshCw />
            Retake quiz
          </Button>
        </>
      )}
      <DevConsole />
    </Page>
  );
}
