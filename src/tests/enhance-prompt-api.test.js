// Comprehensive API Tests for Enhance Prompt Endpoint
// Run with: node src/tests/enhance-prompt-api.test.js

const { fetch } = require('undici'); // Node.js 18+ fetch polyfill

const API_BASE = process.env.TEST_API_BASE || 'http://localhost:3000';
const API_ENDPOINT = `${API_BASE}/api/enhance-prompt`;

// Test data
const validPromptData = {
  characters: [
    {
      id: "1",
      name: "Alex",
      description: "young person",
      speech: "What a beautiful day!"
    }
  ],
  language: "English"
};

const basicRequest = {
  prompt: "A person walking in the park",
  customLimit: 1000,
  model: "gpt-4.1",
  includeAudio: true,
  promptData: validPromptData
};

// Helper function to make API requests
async function makeRequest(data) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    return { response, result, success: response.ok };
  } catch (error) {
    console.error('Request failed:', error);
    return { error, success: false };
  }
}

// Test runner
async function runTests() {
  console.log('🧪 Starting Enhance Prompt API Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  const test = async (name, testFn) => {
    try {
      console.log(`⏳ ${name}`);
      await testFn();
      console.log(`✅ ${name} - PASSED\n`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name} - FAILED`);
      console.log(`   Error: ${error.message}\n`);
      failed++;
    }
  };

  // Test 1: Basic functionality
  await test('Basic prompt enhancement', async () => {
    const { result, success } = await makeRequest(basicRequest);
    
    if (!success) throw new Error(`Request failed: ${result.error}`);
    if (!result.enhancedPrompt) throw new Error('No enhanced prompt returned');
    if (typeof result.enhancedPrompt !== 'string') throw new Error('Enhanced prompt is not a string');
    if (result.enhancedPrompt.length === 0) throw new Error('Enhanced prompt is empty');
    if (!result.metadata) throw new Error('No metadata returned');
    
    console.log(`   ✓ Enhanced prompt length: ${result.characterCount} chars`);
    console.log(`   ✓ Target: ${result.targetCharacters} chars`);
    console.log(`   ✓ Model: ${result.model}`);
  });

  // Test 2: Different character limits
  await test('Character limit variations', async () => {
    const limits = [200, 800, 2000, 4000];
    
    for (const limit of limits) {
      const { result, success } = await makeRequest({
        ...basicRequest,
        customLimit: limit
      });
      
      if (!success) throw new Error(`Failed for limit ${limit}: ${result.error}`);
      if (result.characterLimit !== limit) throw new Error(`Wrong character limit returned: ${result.characterLimit} vs ${limit}`);
      
      console.log(`   ✓ Limit ${limit}: Generated ${result.characterCount} chars`);
    }
  });

  // Test 3: Focus types
  await test('Single focus types', async () => {
    const focusTypes = ['character', 'action', 'cinematic', 'safe'];
    
    for (const focusType of focusTypes) {
      const { result, success } = await makeRequest({
        ...basicRequest,
        focusType
      });
      
      if (!success) throw new Error(`Failed for focus ${focusType}: ${result.error}`);
      if (!result.focusTypes.includes(focusType)) throw new Error(`Focus type ${focusType} not in result`);
      
      console.log(`   ✓ Focus ${focusType}: ${Object.keys(result.metadata.structuredData).length} fields`);
    }
  });

  // Test 4: Multiple focus types
  await test('Multiple focus types', async () => {
    const { result, success } = await makeRequest({
      ...basicRequest,
      focusType: 'character,action,safe'
    });
    
    if (!success) throw new Error(`Request failed: ${result.error}`);
    
    const expectedFocus = ['character', 'action', 'safe'];
    for (const focus of expectedFocus) {
      if (!result.focusTypes.includes(focus)) throw new Error(`Missing focus type: ${focus}`);
    }
    
    const structuredData = result.metadata.structuredData;
    if (!structuredData.character_details) throw new Error('Missing character_details field');
    if (!structuredData.action_sequence) throw new Error('Missing action_sequence field');
    if (!structuredData.safety_compliance) throw new Error('Missing safety_compliance field');
    
    console.log(`   ✓ Multiple focus types: ${result.focusTypes.join(', ')}`);
  });

  // Test 5: Audio handling
  await test('Audio and character speech', async () => {
    // Test with audio enabled
    const { result: withAudio, success: success1 } = await makeRequest({
      ...basicRequest,
      includeAudio: true
    });
    
    if (!success1) throw new Error(`Audio enabled test failed: ${withAudio.error}`);
    if (!withAudio.includeAudio) throw new Error('includeAudio should be true');
    if (!withAudio.enhancedPrompt.includes('AUDIO CUE:')) throw new Error('Missing AUDIO CUE section');
    if (!withAudio.metadata.hasCharacterSpeech) throw new Error('Should detect character speech');
    
    // Test with audio disabled
    const { result: withoutAudio, success: success2 } = await makeRequest({
      ...basicRequest,
      includeAudio: false
    });
    
    if (!success2) throw new Error(`Audio disabled test failed: ${withoutAudio.error}`);
    if (withoutAudio.includeAudio) throw new Error('includeAudio should be false');
    if (withoutAudio.enhancedPrompt.includes('AUDIO CUE:')) throw new Error('Should not include AUDIO CUE section');
    
    console.log(`   ✓ Audio enabled: ${withAudio.metadata.speechExtracted?.length || 0} speeches extracted`);
    console.log(`   ✓ Audio disabled: No audio section`);
  });

  // Test 6: Error handling
  await test('Error handling', async () => {
    // Test empty prompt
    const { result: emptyPrompt, success: success1 } = await makeRequest({
      ...basicRequest,
      prompt: ""
    });
    
    if (success1) throw new Error('Should reject empty prompt');
    if (!emptyPrompt.error) throw new Error('Should return error message');
    
    // Test invalid character limit
    const { result: invalidLimit, success: success2 } = await makeRequest({
      ...basicRequest,
      customLimit: 100
    });
    
    if (success2) throw new Error('Should reject invalid character limit');
    
    // Test invalid model
    const { result: invalidModel, success: success3 } = await makeRequest({
      ...basicRequest,
      model: "invalid-model"
    });
    
    if (success3) throw new Error('Should reject invalid model');
    
    console.log(`   ✓ Empty prompt rejected: ${emptyPrompt.error}`);
    console.log(`   ✓ Invalid limit rejected: ${invalidLimit.error}`);
    console.log(`   ✓ Invalid model rejected: ${invalidModel.error}`);
  });

  // Test 7: VEO3 format validation
  await test('VEO3 format validation', async () => {
    const { result, success } = await makeRequest(basicRequest);
    
    if (!success) throw new Error(`Request failed: ${result.error}`);
    
    const requiredSections = [
      'SCENE DESCRIPTION:',
      'VISUAL STYLE:',
      'CAMERA MOVEMENT:',
      'MAIN SUBJECT:',
      'BACKGROUND SETTING:',
      'LIGHTING/MOOD:',
      'COLOR PALETTE:'
    ];
    
    for (const section of requiredSections) {
      if (!result.enhancedPrompt.includes(section)) {
        throw new Error(`Missing required section: ${section}`);
      }
    }
    
    // Check section formatting (double line breaks)
    if (!result.enhancedPrompt.match(/SCENE DESCRIPTION:.*\n\nVISUAL STYLE:/s)) {
      throw new Error('Incorrect section formatting');
    }
    
    console.log(`   ✓ All ${requiredSections.length} required sections present`);
    console.log(`   ✓ Proper section formatting`);
  });

  // Test 8: Structured data validation
  await test('Structured data validation', async () => {
    const { result, success } = await makeRequest({
      ...basicRequest,
      focusType: 'character,action'
    });
    
    if (!success) throw new Error(`Request failed: ${result.error}`);
    
    const structuredData = result.metadata.structuredData;
    
    // Base fields
    const baseFields = [
      'scene_description', 'visual_style', 'camera_movement', 
      'main_subject', 'background_setting', 'lighting_mood', 
      'color_palette', 'total_character_count', 'focus_areas'
    ];
    
    for (const field of baseFields) {
      if (!structuredData[field]) throw new Error(`Missing base field: ${field}`);
    }
    
    // Type checking
    if (typeof structuredData.scene_description !== 'string') throw new Error('scene_description should be string');
    if (typeof structuredData.total_character_count !== 'number') throw new Error('total_character_count should be number');
    if (!Array.isArray(structuredData.focus_areas)) throw new Error('focus_areas should be array');
    
    console.log(`   ✓ All base fields present: ${baseFields.length}`);
    console.log(`   ✓ Correct data types`);
    console.log(`   ✓ Total structured fields: ${Object.keys(structuredData).length}`);
  });

  // Test 9: Edge cases
  await test('Edge cases', async () => {
    // Very short prompt
    const { result: shortResult, success: success1 } = await makeRequest({
      ...basicRequest,
      prompt: "Run.",
      customLimit: 500
    });
    
    if (!success1) throw new Error(`Short prompt failed: ${shortResult.error}`);
    if (shortResult.enhancedPrompt.length < 100) throw new Error('Enhanced prompt too short for very short input');
    
    // Special characters
    const { result: specialResult, success: success2 } = await makeRequest({
      ...basicRequest,
      prompt: "A robot saying: \"Hello, 世界! ¿Cómo estás?\" with émotions",
    });
    
    if (!success2) throw new Error(`Special characters failed: ${specialResult.error}`);
    if (!specialResult.enhancedPrompt.includes('Hello, 世界! ¿Cómo estás?')) {
      throw new Error('Special characters not preserved');
    }
    
    // Non-English speech
    const { result: nonEnglishResult, success: success3 } = await makeRequest({
      ...basicRequest,
      promptData: {
        characters: [
          {
            id: "1",
            name: "Maria",
            description: "Spanish speaker",
            speech: "¡Qué día tan hermoso!"
          }
        ],
        language: "Spanish"
      }
    });
    
    if (!success3) throw new Error(`Non-English speech failed: ${nonEnglishResult.error}`);
    if (nonEnglishResult.metadata.speechExtracted[0].dialogue !== "¡Qué día tan hermoso!") {
      throw new Error('Non-English speech not preserved');
    }
    
    console.log(`   ✓ Short prompt handled: ${shortResult.characterCount} chars`);
    console.log(`   ✓ Special characters preserved`);
    console.log(`   ✓ Non-English speech preserved: ${nonEnglishResult.metadata.speechExtracted[0].language}`);
  });

  // Test 10: Performance check
  await test('Performance check', async () => {
    const startTime = Date.now();
    
    const { result, success } = await makeRequest(basicRequest);
    
    const duration = Date.now() - startTime;
    
    if (!success) throw new Error(`Request failed: ${result.error}`);
    if (duration > 15000) throw new Error(`Request too slow: ${duration}ms`);
    
    console.log(`   ✓ Request completed in ${duration}ms`);
  });

  // Summary
  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${(passed / (passed + failed) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { makeRequest, basicRequest, validPromptData, runTests }; 