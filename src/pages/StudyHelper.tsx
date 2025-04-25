import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Book,
  Lightbulb,
  BarChart3,
  FileText,
  MessageCircle,
  Sparkles,
  ListChecks,
  History,
  Trash2,
  ArrowRight,
  ArrowDown,
  Save
} from 'lucide-react';

export default function StudyHelper() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('summarize');
  const [history, setHistory] = useState<{
    id: string;
    type: string;
    input: string;
    output: string;
    date: Date;
  }[]>([
    {
      id: '1',
      type: 'summarize',
      input: 'The Industrial Revolution, which took place from the 18th to 19th centuries, was a period during which predominantly agrarian, rural societies in Europe and America became industrial and urban. Prior to this revolution, manufacturing was often done in people\'s homes, using hand tools or basic machines. Industrialization marked a shift to powered machinery, factories and mass production. The iron and textile industries, along with the development of the steam engine, played central roles in the Industrial Revolution, which also saw improved systems of transportation, communication and banking.',
      output: 'The Industrial Revolution (18th-19th centuries) transformed agrarian societies in Europe and America into industrial ones. Manufacturing shifted from homes using hand tools to factories with powered machinery for mass production. Key developments included advancements in iron, textiles, steam power, transportation, communication, and banking systems.',
      date: new Date('2023-11-10T14:30:00')
    },
    {
      id: '2',
      type: 'explain',
      input: 'What is quantum entanglement?',
      output: 'Quantum entanglement is a physical phenomenon that occurs when a pair or group of particles interact in such a way that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance. This means measuring one particle instantly affects its entangled partners, regardless of distance, which Einstein called "spooky action at a distance." This property is fundamental to quantum mechanics and is used in quantum computing and quantum cryptography.',
      date: new Date('2023-11-15T09:45:00')
    }
  ]);
  
  const handleProcess = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      let result = '';
      
      if (activeTab === 'summarize') {
        // Simple summarization simulation
        result = `${inputText.split(' ').slice(0, Math.max(inputText.split(' ').length / 3, 15)).join(' ')}... ${inputText.split('.').slice(-2).join('.')}`;
      } else if (activeTab === 'explain') {
        // Simple explanation simulation
        result = `Here's an explanation about "${inputText}":\n\nThe concept you're asking about relates to ${inputText.split(' ').slice(0, 3).join(' ')} which is an important topic in academic study. It encompasses various principles and applications in its field. The key aspects include understanding the fundamental elements, recognizing patterns, and applying analytical thinking to solve related problems. Many students find this concept challenging at first, but with practice, it becomes clearer. Remember that ${inputText.split(' ').slice(-3).join(' ')} is particularly significant in this context.`;
      } else if (activeTab === 'analyze') {
        // Simple analysis simulation
        result = `Performance Analysis:\n\nBased on the input provided, here's an assessment of academic performance:\n\n1. Strengths: Strong conceptual understanding, good written communication\n\n2. Areas for Improvement: Time management, attention to detail\n\n3. Recommendations:\n   - Focus on practice problems to reinforce concepts\n   - Create a structured study schedule\n   - Consider forming a study group for collaborative learning\n\nOverall, there's good potential with room for strategic improvement.`;
      }
      
      setOutputText(result);
      setIsProcessing(false);
      
      // Add to history
      setHistory([
        {
          id: Date.now().toString(),
          type: activeTab,
          input: inputText,
          output: result,
          date: new Date()
        },
        ...history
      ]);
    }, 2000);
  };
  
  const clearInput = () => {
    setInputText('');
    setOutputText('');
  };
  
  const removeFromHistory = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };
  
  const loadFromHistory = (item: any) => {
    setInputText(item.input);
    setOutputText(item.output);
    setActiveTab(item.type);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get icon for the action type
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'summarize': return <FileText className="h-4 w-4" />;
      case 'explain': return <Lightbulb className="h-4 w-4" />;
      case 'analyze': return <BarChart3 className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Study Helper</h1>
        <p className="text-muted-foreground">
          Use AI to enhance your learning experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-university-primary" />
                AI Learning Assistant
              </CardTitle>
              <CardDescription>
                Enter text or questions and choose an action to help with your studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="mb-6"
              >
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="summarize" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Summarize
                  </TabsTrigger>
                  <TabsTrigger value="explain" className="flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Explain
                  </TabsTrigger>
                  <TabsTrigger value="analyze" className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analyze
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="summarize" className="mt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste your study material, lecture notes, or articles to generate a concise summary of key points.
                  </p>
                </TabsContent>
                
                <TabsContent value="explain" className="mt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter a concept or topic you'd like explained in simple, easy-to-understand terms.
                  </p>
                </TabsContent>
                
                <TabsContent value="analyze" className="mt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Input your academic performance data or study habits for personalized analysis and improvement suggestions.
                  </p>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="input" className="text-sm font-medium">
                    Input Text
                  </label>
                  <Textarea
                    id="input"
                    placeholder={activeTab === 'summarize' 
                      ? "Paste your text here to summarize..." 
                      : activeTab === 'explain'
                        ? "Enter a concept or topic you'd like explained..."
                        : "Describe your current study habits and academic performance..."
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearInput}
                      className="h-8"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleProcess}
                    disabled={!inputText.trim() || isProcessing}
                    className="bg-university-primary hover:bg-university-primary/90"
                  >
                    {isProcessing ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-4 w-4 mr-2" />
                        {activeTab === 'summarize' 
                          ? 'Summarize Text' 
                          : activeTab === 'explain'
                            ? 'Explain Concept'
                            : 'Analyze Performance'
                        }
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="output" className="text-sm font-medium flex justify-between">
                    <span>AI Output</span>
                    {outputText && (
                      <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
                        <Save className="h-3 w-3 mr-1" />
                        Save to Notes
                      </Button>
                    )}
                  </label>
                  <div 
                    className="min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center h-full">
                        <Spinner size="md" className="mr-2" />
                        <p>Generating {activeTab === 'summarize' 
                          ? 'summary' 
                          : activeTab === 'explain'
                            ? 'explanation'
                            : 'analysis'
                        }...</p>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{outputText}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5 text-university-primary" />
                Study Tips & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <ListChecks className="mr-2 h-4 w-4 text-university-secondary" />
                    Effective Study Techniques
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break</li>
                    <li>Create concept maps to visualize and connect ideas</li>
                    <li>Teach concepts to someone else to reinforce understanding</li>
                    <li>Practice active recall instead of passive re-reading</li>
                    <li>Use spaced repetition for better long-term retention</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Library Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Access the university library's digital resources, research databases, and academic journals to enhance your studies.
                    </p>
                    <Button variant="link" className="px-0 h-8 text-university-primary">
                      Browse Library Resources
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Tutoring Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Schedule one-on-one or group tutoring sessions with academic support staff in your subject area.
                    </p>
                    <Button variant="link" className="px-0 h-8 text-university-primary">
                      Book a Tutor
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5 text-university-primary" />
                History
              </CardTitle>
              <CardDescription>
                Your recent AI interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map(item => (
                    <div 
                      key={item.id}
                      className="border rounded-md p-3 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="flex items-center">
                          {getActionIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </Badge>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => loadFromHistory(item)}
                          >
                            <ArrowRight className="h-3 w-3" />
                            <span className="sr-only">Load</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500"
                            onClick={() => removeFromHistory(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <div className="line-clamp-2 mb-1">
                        {item.input}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(item.date)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No history yet</p>
                  <p className="text-xs mt-1">Your AI interactions will appear here</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setHistory([])}
                disabled={history.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
