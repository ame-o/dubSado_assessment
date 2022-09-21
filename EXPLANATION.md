npm start

//Any noteworthy logic/style decisions you made? If so, what is your reasoning?
- used Javascript rather than Typescript
- used 'npm' in place of 'yarn' as I use node for my coding
- created a map instead of a tree with nodes for the company structure 

My reason being the short time frame, I am not incredibly familiar with trees outside of BSTs. Other strongly typed language might make this easier with types and built ins. However, I was able to mimic a tree-like structure with the map. I kept all the information from the JSON in case I wanted to use the information with other methods.

If you had more time, what improvements would you implement?
Unfortunately, for this assessment I do recognize that the time constraint is not a matter as I do need to have deeper learning of Trees as data structures. If I had more time, I would have also added methods for the additional information I included. I did not use any styling as I might have misunderstood thinking this was without any front end. A visualization of the company structure would be fun, as well cleaning up code to be dry and concise.

I would definitely give creating the Tree another attempt with a better understanding on how traversing a non-binary tree works. The construction of the tree is what delayed me as I was unsure how to add leaves when the depth continues without heavy recursion or repetitive code. I've attached the node logic as "node logic" in case I could ask someone questions for improvements. :)

//Bonus: What is the time complexity of each function in your code?

//Bonus: There are two functions that have very similar logic and could be merged into one. Which functions do you think can be merged and why?

Combining promote and demote would be beneficial especially if the company already knows who they want to take the lead position.

If fireEmployee is also in junction with a promotion, they all work similarly and could be combined or addressed with a helper function.
