# TODO: Integrate React Hook Form into LoginContainer and RegisterContainer

## Steps to Complete

1. **Update LoginContainer.tsx**
   - Import `useForm` from 'react-hook-form'
   - Import Form components from '../components/ui/form'
   - Replace useState for email and password with useForm hook
   - Add validation rules: email required, password required
   - Update handleSubmit to use form's handleSubmit
   - Use FormField, FormItem, FormLabel, FormControl, FormMessage for inputs
   - Ensure dispatch(loginUser) on successful submission
   - Keep toast for success/error

2. **Update RegisterContainer.tsx**
   - Import `useForm` from 'react-hook-form'
   - Import Form components from '../components/ui/form'
   - Replace useState for name, email, password, confirmPassword with useForm hook
   - Add validation rules: name required, email required, password required (min 6 chars), confirmPassword required and must match password
   - Update handleSubmit to use form's handleSubmit
   - Use FormField, FormItem, FormLabel, FormControl, FormMessage for inputs
   - Ensure dispatch(registerUser) on successful submission
   - Keep toast for success/error

3. **Test the Changes**
   - Run unit tests for LoginContainer and RegisterContainer
   - Run e2e tests if applicable
   - Manually test forms for validation and submission

4. **Verify UI and Functionality**
   - Ensure all existing UI styling and components are intact
   - Check that forms handle validation errors with inline messages
   - Confirm Redux dispatches work correctly
