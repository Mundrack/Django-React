import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import QuestionCard from '../../components/audits/QuestionCard';
import auditService from '../../services/auditService';

const ExecuteAuditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, [id]);

  const fetchAuditData = async () => {
    try {
      const auditResponse = await auditService.getAudit(id);
      const auditData = auditResponse.data || auditResponse;
      setAudit(auditData);

      const questionsResponse = await auditService.getQuestions(id);
      const questionsData = questionsResponse.data || questionsResponse || [];
      setQuestions(questionsData);

      const uniqueSections = [];
      const sectionMap = {};
      questionsData.forEach(q => {
        if (!sectionMap[q.section_id]) {
          sectionMap[q.section_id] = true;
          uniqueSections.push({
            id: q.section_id,
            name: q.section_name,
            code: q.section_code
          });
        }
      });
      setSections(uniqueSections);

      const existingAnswers = {};
      questionsData.forEach(q => {
        if (q.answer !== null && q.answer !== undefined) {
          existingAnswers[q.id] = {
            value: q.answer,
            comment: q.comment || ''
          };
        }
      });
      setAnswers(existingAnswers);

    } catch (error) {
      console.error('Error fetching audit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId, value, comment) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, comment }
    }));

    try {
      await auditService.submitAnswer(id, questionId, {
        answer: value,
        comment: comment
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await auditService.completeAudit(id);
      navigate('/audits/' + id);
    } catch (error) {
      console.error('Error completing audit:', error);
      alert('Error al completar la auditoria');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!audit) return <div className="text-white">Auditoria no encontrada</div>;

  const currentSectionData = sections[currentSection];
  const currentQuestions = questions.filter(
    q => q.section_id === (currentSectionData ? currentSectionData.id : null)
  );

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;
  const canComplete = totalAnswered === totalQuestions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/audits')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{audit.name}</h1>
            <p className="text-gray-400">Ejecutando auditoria</p>
          </div>
        </div>
        <button
          onClick={handleComplete}
          disabled={!canComplete || saving}
          className={'px-4 py-2 rounded-lg flex items-center ' + 
            (canComplete ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed')
          }
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {saving ? 'Guardando...' : 'Completar Auditoria'}
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progreso General</span>
          <span className="text-white">{totalAnswered} de {totalQuestions} preguntas ({progress.toFixed(0)}%)</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all"
            style={{ width: progress + '%' }}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section, index) => {
          const sectionQuestions = questions.filter(q => q.section_id === section.id);
          const sectionAnswered = sectionQuestions.filter(q => answers[q.id]).length;
          const isComplete = sectionAnswered === sectionQuestions.length;

          return (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={'px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ' +
                (currentSection === index
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700')
              }
            >
              {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
              <span>{section.code}</span>
              <span className="text-xs opacity-70">({sectionAnswered}/{sectionQuestions.length})</span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">
            {currentSectionData ? currentSectionData.name : 'Seccion'}
          </h2>
          <p className="text-sm text-gray-400">
            {currentQuestions.length} preguntas en esta seccion
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {currentQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                number={index + 1}
                answer={answers[question.id]}
                onAnswer={(value, comment) => handleAnswer(question.id, value, comment)}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
          disabled={currentSection === 0}
          className={'px-4 py-2 rounded-lg flex items-center ' +
            (currentSection === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600')
          }
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Seccion Anterior
        </button>
        <button
          onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
          disabled={currentSection === sections.length - 1}
          className={'px-4 py-2 rounded-lg flex items-center ' +
            (currentSection === sections.length - 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600')
          }
        >
          Siguiente Seccion
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ExecuteAuditPage;