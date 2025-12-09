import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const QuestionCard = ({ question, number, answer, onAnswer }) => {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(answer?.comment || '');

  const questionText = question.text || question.question_text || 'Pregunta sin texto';
  const questionCode = question.code || question.question_code || '';
  const questionType = question.question_type || question.type || 'yes_no';

  const handleChange = (value) => {
    onAnswer(value, comment);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    onAnswer(answer?.value, e.target.value);
  };

  const renderInput = () => {
    switch (questionType) {
      case 'yes_no':
        return (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleChange('yes')}
              className={'px-6 py-3 rounded-lg font-medium transition-all ' +
                (answer?.value === 'yes'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
              }
            >
              Si
            </button>
            <button
              onClick={() => handleChange('no')}
              className={'px-6 py-3 rounded-lg font-medium transition-all ' +
                (answer?.value === 'no'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
              }
            >
              No
            </button>
            <button
              onClick={() => handleChange('na')}
              className={'px-6 py-3 rounded-lg font-medium transition-all ' +
                (answer?.value === 'na'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
              }
            >
              N/A
            </button>
          </div>
        );

      case 'scale':
        return (
          <div className="flex gap-2 mt-4 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => handleChange(num)}
                className={'w-12 h-12 rounded-lg font-medium transition-all ' +
                  (answer?.value === num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                }
              >
                {num}
              </button>
            ))}
          </div>
        );

      case 'multiple_choice':
        const choices = question.choices || [];
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChange(choice)}
                className={'px-4 py-2 rounded-lg font-medium transition-all ' +
                  (answer?.value === choice
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                }
              >
                {choice}
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={answer?.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white mt-4"
            rows={3}
            placeholder="Escribe tu respuesta..."
          />
        );

      default:
        return (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleChange('yes')}
              className={'px-6 py-3 rounded-lg font-medium transition-all ' +
                (answer?.value === 'yes'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
              }
            >
              Si
            </button>
            <button
              onClick={() => handleChange('no')}
              className={'px-6 py-3 rounded-lg font-medium transition-all ' +
                (answer?.value === 'no'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
              }
            >
              No
            </button>
            <button
              onClick={() => handleChange('na')}
              className={'px-6 py-3 rounded-lg font-medium transition-all ' +
                (answer?.value === 'na'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
              }
            >
              N/A
            </button>
          </div>
        );
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
            {number}
          </span>
          <div className="flex-1">
            <p className="text-white font-medium text-lg">{questionText}</p>
            {questionCode && (
              <p className="text-sm text-gray-400 mt-1">Codigo: {questionCode}</p>
            )}
            {renderInput()}
          </div>
        </div>
        <button
          onClick={() => setShowComment(!showComment)}
          className={'p-2 rounded-lg transition-all ml-4 ' +
            (showComment || comment ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600')
          }
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {showComment && (
        <div className="mt-4 ml-11">
          <label className="block text-sm text-gray-400 mb-2">Comentario (opcional)</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            rows={2}
            placeholder="Agrega un comentario..."
          />
        </div>
      )}
    </div>
  );
};

export default QuestionCard;