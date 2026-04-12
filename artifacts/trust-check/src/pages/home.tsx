import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, ShieldCheck, ShieldAlert, ArrowRight, RefreshCw, Loader2, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnalyseConversation } from "@workspace/api-client-react";
import { type AnalyseResult } from "@workspace/api-client-react/src/generated/api.schemas";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustScore } from "@/components/trust-score";
import { RedFlagTimeline } from "@/components/red-flag-timeline";
import { ScamPersonas } from "@/components/scam-personas";
import { ScamConversations } from "@/components/scam-conversations";

const formSchema = z.object({
  conversation: z.string().min(20, "Please paste a slightly longer conversation for an accurate analysis."),
});

export default function Home() {
  const [result, setResult] = useState<AnalyseResult | null>(null);
  
  const { mutate: analyse, isPending } = useAnalyseConversation({
    mutation: {
      onSuccess: (data) => {
        setResult(data);
      }
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conversation: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    analyse({ data: values });
  }

  function reset() {
    setResult(null);
    form.reset();
  }

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-16">
          <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/30">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">TrustCheck</h1>
            <p className="text-sm font-medium text-slate-400">AI Romance Scam Forensics</p>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6 leading-tight">
                    Protect yourself from digital deception.
                  </h2>
                  <p className="text-lg text-slate-400 leading-relaxed mb-8">
                    Paste a conversation from WhatsApp, Instagram, or any dating app. Our forensic AI will analyse the linguistic patterns for manipulation, urgency, and common scam vectors.
                  </p>
                </div>

                <Card className="bg-slate-900 border-slate-800 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-1">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="conversation"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Paste the chat history here..."
                                  className="min-h-[300px] border-0 bg-transparent resize-none text-base p-6 placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="px-6 pb-2 text-rose-500 font-medium" />
                            </FormItem>
                          )}
                        />
                        <div className="p-4 bg-slate-950/50 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Info className="w-4 h-4" />
                            <span>Your data is processed securely and never stored.</span>
                          </div>
                          <Button 
                            type="submit" 
                            size="lg" 
                            disabled={isPending}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analysing Patterns
                              </>
                            ) : (
                              <>
                                Analyse Conversation
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <ScamPersonas />
                <ScamConversations />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-medium tracking-tight text-white">Analysis Report</h2>
                  <Button variant="outline" size="sm" onClick={reset} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Analyse Another
                  </Button>
                </div>

                <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                  {/* Score Card */}
                  <Card className="bg-slate-900 border-slate-800 flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl">
                    <TrustScore score={result.trustScore} className="mb-6" />
                    
                    {result.verdict === "safe" && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 text-sm font-medium rounded-full">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Safe Interaction
                      </Badge>
                    )}
                    {result.verdict === "caution" && (
                      <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 text-sm font-medium rounded-full">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Proceed with Caution
                      </Badge>
                    )}
                    {result.verdict === "danger" && (
                      <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-1.5 text-sm font-medium rounded-full">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        High Risk of Scam
                      </Badge>
                    )}
                  </Card>

                  {/* Summary Card */}
                  <Card className="bg-slate-900 border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col justify-center">
                    <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-4">Forensic Summary</h3>
                    <p className="text-lg text-slate-200 leading-relaxed font-serif">
                      {result.summary}
                    </p>
                  </Card>
                </div>

                {/* Timeline and Breakdown */}
                {result.redFlags.length > 0 ? (
                  <Card className="bg-slate-900 border-slate-800 p-8 rounded-2xl shadow-xl overflow-hidden">
                    <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-6">Interaction Timeline</h3>
                    <RedFlagTimeline flags={result.redFlags} />
                    
                    <div className="mt-12 space-y-6">
                      <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-4">Detected Manipulations</h3>
                      {result.redFlags.map((flag, i) => (
                        <motion.div 
                          key={flag.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + (i * 0.1) }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60"
                        >
                          <div className="mt-0.5">
                            {flag.severity === "high" ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                            ) : flag.severity === "medium" ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-medium text-slate-200">{flag.label}</h4>
                              <Badge variant="outline" className={
                                flag.severity === "high" ? "text-rose-400 border-rose-500/20" :
                                flag.severity === "medium" ? "text-amber-400 border-amber-500/20" :
                                "text-blue-400 border-blue-500/20"
                              }>
                                {flag.severity} severity
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                              {flag.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <Card className="bg-slate-900 border-slate-800 p-8 rounded-2xl shadow-xl flex items-center justify-center py-16">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">No red flags detected</h3>
                      <p className="text-slate-400 text-sm">
                        The conversation appears typical without common manipulative patterns or urgency triggers. Always remain cautious, but this particular chat looks clear.
                      </p>
                    </div>
                  </Card>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
